const { MessageEmbed } = require('discord.js')
const { sleep } = require('../utilities')
const WebsocketServer = require('websocket').server

const clients = {}

function stringify (queue) {
  return JSON.stringify({
    guild: queue.guild.id,
    nowPlaying: queue.nowPlaying,
    tracks: queue.tracks,
    paused: queue.paused,
    volume: queue.volume,
    repeatMode: queue.repeatMode,
    currentTime: queue.currentTime
  })
}

module.exports = {
  setup: (client, domain) => {
    const wss = new WebsocketServer({ httpServer: client.dashboard })

    // noinspection JSUnresolvedFunction
    wss.on('request', request => {
      if (request.origin !== domain) { return request.reject() }
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
        const queue = client.player.getQueue(guild)
        if (!queue || !queue.playing) { return ws.sendUTF(JSON.stringify({ current: false })) }

        // TODO: Checks for user channel

        switch (data.type) {
          // TODO: Feedback messages
          case 'request': {
            ws.sendUTF(stringify(queue))
            return
          }
          case 'previous': {
            if (queue.currentTime > 5000) {
              await queue.seek(0)
              break
            }
            try {
              await queue.previous()
            } catch (e) {
              await queue.seek(0)
            }
            await sleep(3)
            break
          }
          case 'pause': {
            queue.setPaused(!queue.connection.paused)
            break
          }
          case 'skip': {
            queue.skip()
            await sleep(2)
            break
          }
          case 'shuffle': {
            queue.shuffle()
            break
          }
          case 'repeat': {
            queue.setRepeatMode(queue.repeatMode === 2 ? 0 : queue.repeatMode + 1)
            break
          }
          case 'volume': {
            queue.setVolume(data.volume)
            break
          }
          case 'play': {
            if (!data.query) { return }
            const result = await queue.play(data.query, { requestedBy: user })
            if (!result) { return } // TODO: Error message: There was an error while adding your song to the queue.

            const embed = new MessageEmbed()
              .setAuthor({ name: 'Added to queue.', iconURL: user.displayAvatarURL() })
              .setTitle(result.title)
              .setURL(result.url)
              .setThumbnail(result.thumbnail)
              .setFooter({ text: 'SuitBot', iconURL: client.user.displayAvatarURL() })

            if (result.playlist) {
              embed
                .addField('Amount', `${result.tracks.length} songs`, true)
                .addField('Author', result.author, true)
                .addField('Position', `${queue.tracks.indexOf(result.tracks[0]).toString()}-${queue.tracks.indexOf(result.tracks[result.tracks.length - 1]).toString()}`, true)
            } else {
              embed
                .addField('Duration', result.live ? '🔴 Live' : result.duration, true)
                .addField('Author', result.author, true)
                .addField('Position', queue.tracks.indexOf(result).toString(), true)
            }
            await sleep(2)
            break
          }
          case 'clear': {
            queue.clear()
            break
          }
          case 'remove': {
            queue.remove(data.index)
            break
          }
          case 'skipto': {
            queue.skip(data.index)
            await sleep(2)
            break
          }
        }
        client.dashboard.emit('update', queue)
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
          ws.sendUTF(stringify(queue))
        }
      }
    })
  }
}
