const { MessageEmbed } = require('discord.js')
const { sleep } = require('../utilities')
const WebsocketServer = require('websocket').server

const clients = {}

function stringify (queue) {
  return JSON.stringify({
    guild: queue.guild.id,
    current: queue.current,
    tracks: queue.tracks.map(track => track.toJSON()),
    paused: queue.connection.paused,
    volume: queue.volume,
    repeatMode: queue.repeatMode,
    streamTime: queue.streamTime
  })
}

module.exports = {
  setupWebsocket: (client, domain) => {
    const wss = new WebsocketServer({ httpServer: client.dashboard })

    // noinspection JSUnresolvedFunction
    wss.on('request', request => {
      if (request.origin !== domain) { return request.reject() }
      const ws = request.accept(null, request.origin)
      let guildId, userId

      ws.on('message', async message => {
        if (message.type !== 'utf8') { return }
        const data = JSON.parse(message.utf8Data)
        console.log(data)

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
        const user = await client.users.fetch(data.userId)
        if (!user) { return ws.close() }
        const queue = client.player.getQueue(guild)
        if (!queue) { return ws.sendUTF(JSON.stringify({ empty: true })) }

        // TODO: Checks for user channel

        switch (data.type) {
          // TODO: Feedback messages
          case 'request': {
            ws.sendUTF(stringify(queue))
            return
          }
          case 'previous': {
            if (queue.streamTime > 5000) {
              await queue.seek(0)
              break
            }
            try {
              await queue.back()
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
            const searchResult = await client.player.search(data.query, { requestedBy: user, searchEngine: 'playdl' })
            if (!searchResult || !searchResult.tracks.length) { return } // TODO: Error message: There was an error while adding your song to the queue.

            if (searchResult.playlist) {
              const playlist = searchResult.playlist
              queue.addTracks(playlist.tracks)
              if (!queue.playing) { await queue.play() }

              queue.metadata.channel.send({
                embeds: [new MessageEmbed()
                  .setAuthor({ name: 'Added to queue.', iconURL: user.displayAvatarURL() })
                  .setTitle(playlist.title)
                  .setURL(playlist.url)
                  .setThumbnail(playlist.thumbnail)
                  .addField('Amount', `${playlist.tracks.length} songs`, true)
                  .addField('Author', playlist.author.name ?? playlist.author, true)
                  .addField('Position', `${(queue.getTrackPosition(playlist.tracks[0]) + 1).toString()}-${(queue.getTrackPosition(playlist.tracks[playlist.tracks.length - 1]) + 1).toString()}`, true)
                  .setFooter({ text: 'SuitBot Web Interface', iconURL: client.user.displayAvatarURL() })
                ]
              })
            } else {
              const track = searchResult.tracks[0]
              queue.addTrack(track)
              if (!queue.playing) { await queue.play() }

              queue.metadata.channel.send({
                embeds: [new MessageEmbed()
                  .setAuthor({ name: 'Added to queue.', iconURL: user.displayAvatarURL() })
                  .setTitle(track.title)
                  .setURL(track.url)
                  .setThumbnail(track.thumbnail)
                  .addField('Duration', track.durationMS === 0 ? '🔴 Live' : track.duration, true)
                  .addField('Author', track.author, true)
                  .addField('Position', (queue.getTrackPosition(track) + 1).toString(), true)
                  .setFooter({ text: 'SuitBot Web Interface', iconURL: client.user.displayAvatarURL() })
                ]
              })
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
            queue.skipTo(data.index)
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
