const { MessageEmbed } = require('discord.js')
const WebsocketServer = require('websocket').server

const clients = {}

function simplifyQueue (queue) {
  if (!queue || !queue.playing) { return {} }
  return {
    guild: queue.guild.id,
    nowPlaying: queue.nowPlaying,
    tracks: queue.tracks,
    paused: queue.paused,
    volume: queue.volume,
    repeatMode: queue.repeatMode,
    currentTime: queue.currentTime
  }
}

function send (ws, data) {
  ws.sendUTF(JSON.stringify(Object.assign({}, data)))
}

module.exports = {
  setup: (client, domain) => {
    const wss = new WebsocketServer({ httpServer: client.dashboard })

    // noinspection JSUnresolvedFunction
    wss.on('request', request => {
      if (request.origin !== domain && request.origin !== 'https://suitbot.xyz') { return request.reject() }
      const ws = request.accept(null, request.origin)
      let guildId, userId

      ws.on('message', async message => {
        if (message.type !== 'utf8') { return }
        const data = JSON.parse(message.utf8Data)

        // Add to client manager
        guildId = data.guildId
        userId = data.userId
        if (clients[data.guildId]) {
          clients[data.guildId][data.userId] = ws
        } else {
          clients[data.guildId] = { [data.userId]: ws }
        }

        // Fetch guild, user and queue
        const guild = client.guilds.cache.get(data.guildId)
        if (!guild) { return ws.close() }
        const user = await client.users.cache.get(data.userId)
        if (!user) { return ws.close() }
        const queue = client.player.getQueue(guild.id)
        if (!queue || !queue.playing) { return send(ws, {}) }

        if (data.type === 'request') { return send(ws, simplifyQueue(queue)) }

        if (guild.members.cache.get(user.id)?.voice.channel !== guild.me.voice.channel) { return send(ws, { toast: { message: 'You need to be in the same voice channel as the bot to use this command!', type: 'danger' } }) }

        const toast = { message: null, type: 'info' }
        switch (data.type) {
          case 'previous': {
            if (queue.currentTime > 5000) {
              await queue.seek(0)
              break
            }
            try {
              await queue.previous()
              toast.message = 'Skipped to previous song.'
            } catch (e) {
              await queue.seek(0)
            }
            break
          }
          case 'pause': {
            queue.setPaused(!queue.connection.paused)
            toast.message = queue.connection.paused ? 'Paused.' : 'Resumed.'
            break
          }
          case 'skip': {
            queue.skip()
            toast.message = 'Skipped.'
            break
          }
          case 'shuffle': {
            queue.shuffle()
            toast.message = 'Shuffled the queue.'
            break
          }
          case 'repeat': {
            queue.setRepeatMode(queue.repeatMode === 2 ? 0 : queue.repeatMode + 1)
            toast.message = `Set repeat mode to "${{ 0: 'None', 1: 'Track', 2: 'Queue' }[queue.repeatMode]}"`
            break
          }
          case 'volume': {
            queue.setVolume(data.volume)
            toast.message = `Set volume to ${data.volume}.`
            break
          }
          case 'play': {
            if (!data.query) { return }
            const result = await queue.play(data.query, { requestedBy: user })
            if (!result) { return send(ws, { toast: { message: 'There was an error while adding your song/playlist to the queue.', type: 'danger' } }) }

            const embed = new MessageEmbed()
              .setAuthor({ name: 'Added to queue.', iconURL: user.displayAvatarURL() })
              .setTitle(result.title)
              .setURL(result.url)
              .setThumbnail(result.thumbnail)
              .setFooter({ text: 'SuitBot Web Dashboard', iconURL: client.user.displayAvatarURL() })

            if (result.playlist) {
              toast.message = `Added playlist "${result.title}" to the queue.`
              embed
                .addField('Amount', `${result.tracks.length} songs`, true)
                .addField('Author', result.author, true)
                .addField('Position', `${queue.tracks.indexOf(result.tracks[0]).toString()}-${queue.tracks.indexOf(result.tracks[result.tracks.length - 1]).toString()}`, true)
            } else {
              toast.message = `Added "${result.title}" to the queue.`
              embed
                .addField('Duration', result.live ? '🔴 Live' : result.duration, true)
                .addField('Author', result.author, true)
                .addField('Position', queue.tracks.indexOf(result).toString(), true)
            }
            toast.type = 'success'
            queue.channel.send({ embeds: [embed] })
            break
          }
          case 'clear': {
            queue.clear()
            toast.message = 'Cleared the queue.'
            break
          }
          case 'remove': {
            const track = queue.remove(data.index)
            toast.message = `Removed track #${data.index}: "${track.title}"`
            break
          }
          case 'skipto': {
            queue.skip(data.index)
            toast.message = `Skipped to #${data.index}: "${queue.tracks[1].title}"`
            break
          }
        }
        send(ws, { toast: toast })
      })

      ws.on('close', () => {
        // Remove from client manager
        if (!guildId || !userId) { return }
        delete clients[guildId][userId]
        if (Object.keys(clients[guildId]).length === 0) { delete clients[guildId] }
      })
    })

    client.dashboard.on('update', queue => {
      if (clients[queue.guild.id]) {
        for (const user in clients[queue.guild.id]) {
          const ws = clients[queue.guild.id][user]
          send(ws, simplifyQueue(queue))
        }
      }
    })
  }
}
