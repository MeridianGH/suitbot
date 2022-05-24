import { MessageEmbed } from 'discord.js'
import { server as WebsocketServer } from 'websocket'
import { msToHMS } from '../utilities/utilities.js'
import { getLanguage } from '../language/locale.js'

const clients = {}

function simplifyPlayer(player) {
  if (!player) { return {} }
  return {
    guild: player.guild,
    queue: player.queue,
    current: player.queue.current,
    paused: player.paused,
    volume: player.volume,
    filter: player.filter,
    position: player.position,
    timescale: player.timescale,
    repeatMode: player.queueRepeat ? 'queue' : player.trackRepeat ? 'track' : 'none'
  }
}

function send(ws, data) {
  ws.sendUTF(JSON.stringify(Object.assign({}, data)))
}

export function setupWebsocket(client, domain) {
  const wss = new WebsocketServer({ httpServer: client.dashboard })

  // noinspection JSUnresolvedFunction
  wss.on('request', (request) => {
    if (request.origin !== domain && request.origin !== 'https://suitbot.xyz') { return request.reject() }
    const ws = request.accept(null, request.origin)
    let guildId, userId

    ws.on('message', async (message) => {
      if (message.type !== 'utf8') { return }
      const data = JSON.parse(message.utf8Data)
      console.log(data)

      // Add to client manager
      guildId = data.guildId
      userId = data.userId
      clients[data.guildId] = { ...clients[data.guildId], [data.userId]: ws }

      // Fetch guild, user and queue
      const guild = client.guilds.cache.get(data.guildId)
      if (!guild) { return ws.close() }
      const user = await client.users.cache.get(data.userId)
      if (!user) { return ws.close() }
      const player = client.lavalink.getPlayer(guild.id)
      if (!player) { return send(ws, {}) }

      if (data.type === 'request') { return send(ws, simplifyPlayer(player)) }

      if (guild.members.cache.get(user.id)?.voice.channel !== guild.me.voice.channel) { return send(ws, { toast: { message: 'You need to be in the same voice channel as the bot to use this command!', type: 'danger' } }) }

      let toast = null
      switch (data.type) {
        case 'previous': {
          if (player.position > 5000) {
            await player.seek(0)
            break
          }
          try {
            if (player.previousTracks.length === 0) { return send(ws, { toast: { message: 'You can\'t skip to a previous song!' } }) }
            const track = player.previousTracks.pop()
            player.queue.add(track, 0)
            player.manager.once('trackEnd', (player) => { player.queue.add(player.previousTracks.pop(), 0) })
            player.stop()
            toast = { message: 'Skipped to previous song.', type: 'info' }
          } catch (e) {
            await player.seek(0)
          }
          break
        }
        case 'pause': {
          player.pause(!player.paused)
          toast = { message: player.paused ? 'Paused.' : 'Resumed.', type: 'info' }
          break
        }
        case 'skip': {
          player.stop()
          toast = { message: 'Skipped.', type: 'info' }
          break
        }
        case 'shuffle': {
          player.queue.shuffle()
          toast = { message: 'Shuffled the queue.', type: 'info' }
          break
        }
        case 'repeat': {
          player.trackRepeat ? player.setQueueRepeat(true) : player.queueRepeat ? player.setTrackRepeat(false) : player.setTrackRepeat(true)
          toast = { message: `Set repeat mode to "${player.queueRepeat ? 'Queue' : player.trackRepeat ? 'Track' : 'None'}"`, type: 'info' }
          break
        }
        case 'volume': {
          player.setVolume(data.volume)
          break
        }
        case 'filter': {
          // noinspection JSUnresolvedFunction
          player.setFilter(data.filter)
          toast = { message: `Set filter to "${data.filter}"`, type: 'info' }
          break
        }
        case 'play': {
          if (!data.query) { return }
          const result = await player.search(data.query, user)
          if (result.loadType === 'LOAD_FAILED' || result.loadType === 'NO_MATCHES') { return send(ws, { toast: { message: 'There was an error while adding your song/playlist to the queue.', type: 'danger' } }) }
          const lang = getLanguage(await client.database.getLocale(guild.id)).play

          const embed = new MessageEmbed()
            .setAuthor({ name: lang.author, iconURL: user.displayAvatarURL() })
            .setFooter({ text: 'SuitBot Web Dashboard', iconURL: client.user.displayAvatarURL() })

          if (result.loadType === 'PLAYLIST_LOADED') {
            player.queue.add(result.tracks)
            if (player.state !== 'CONNECTED') { await player.connect() }
            if (!player.playing && !player.paused && player.queue.totalSize === result.tracks.length) { await player.play() }
            // noinspection JSUnresolvedVariable
            embed
              .setTitle(result.playlist.name)
              .setURL(result.playlist.uri)
              .setThumbnail(result.playlist.thumbnail)
              .addField(lang.fields.amount.name, lang.fields.amount.value(result.tracks.length), true)
              .addField(lang.fields.author.name, result.playlist.author, true)
              .addField(lang.fields.position.name, `${player.queue.indexOf(result.tracks[0]) + 1}-${player.queue.indexOf(result.tracks[result.tracks.length - 1]) + 1}`, true)
          } else {
            const track = result.tracks[0]
            player.queue.add(track)
            if (player.state !== 'CONNECTED') { await player.connect() }
            if (!player.playing && !player.paused && !player.queue.length) { await player.play() }

            embed
              .setTitle(track.title)
              .setURL(track.uri)
              .setThumbnail(track.thumbnail)
              .addField(lang.fields.duration.name, track.isStream ? '🔴 Live' : msToHMS(track.duration), true)
              .addField(lang.fields.author.name, track.author, true)
              .addField(lang.fields.position.name, (player.queue.indexOf(track) + 1).toString(), true)
          }
          await client.channels.cache.get(player.textChannel).send({ embeds: [embed] })
          break
        }
        case 'clear': {
          player.queue.clear()
          toast = { message: 'Cleared the queue.', type: 'info' }
          break
        }
        case 'remove': {
          const track = player.queue.remove(data.index - 1)[0]
          toast = { message: `Removed track #${data.index}: "${track.title}"`, type: 'info' }
          break
        }
        case 'skipto': {
          const track = player.queue[data.index - 1]
          player.stop(data.index)
          toast = { message: `Skipped to #${data.index}: "${track.title}"`, type: 'info' }
          break
        }
      }
      if (toast) { send(ws, { toast: toast }) }
      client.dashboard.update(player)
    })

    ws.on('close', () => {
      // Remove from client manager
      if (!guildId || !userId) { return }
      delete clients[guildId][userId]
      if (Object.keys(clients[guildId]).length === 0) { delete clients[guildId] }
    })
  })

  client.dashboard.on('update', (player) => {
    if (clients[player.guild]) {
      for (const user of Object.keys(clients[player.guild])) {
        const ws = clients[player.guild][user]
        send(ws, simplifyPlayer(player))
      }
    }
  })

  return wss
}
