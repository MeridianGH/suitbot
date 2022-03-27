const { Collection } = require('discord.js')
const playdl = require('play-dl')
const Queue = require('./Queue')
const { simpleEmbed } = require('../utilities')

// noinspection JSIgnoredPromiseFromCall
module.exports = class Player {
  constructor (client) {
    this.client = client
    this.queues = new Collection()

    this.client.on('voiceStateUpdate', (oldState, newState) => {
      this._voiceUpdate(oldState, newState)
    })

    playdl.getFreeClientID().then(clientId => { playdl.setToken({ soundcloud: { client_id: clientId } }) })
    playdl.setToken({ youtube: { cookie: process.env.cookie ?? require('../config.json').cookie } })
  }

  createQueue (guildId) {
    const guild = this.client.guilds.resolve(guildId)
    if (!guild) { return null }
    if (this.queues.has(guildId) && !this.queues.get(guildId).destroyed) { return this.queues.get(guildId) }

    const queue = new Queue(this, guild)
    this.queues.set(guildId, queue)
    return queue
  }

  getQueue (guildId) {
    return this.queues.get(guildId)
  }

  deleteQueue (guildId) {
    this.queues.delete(guildId)
  }

  _voiceUpdate (oldState, newState) {
    const queue = this.queues.get(oldState.guild.id)
    if (!queue) { return }

    // Client events
    if (newState.guild.me.id === newState.member.id) {
      // Disconnect
      if (!newState.channelId) { return queue.stop() }
      // Suppressed
      if (queue.playing && !oldState.suppress && newState.suppress) {
        queue.setPaused(true)
        queue.guild.me.voice.setRequestToSpeak(true)
      } else if (queue.playing && oldState.suppress && !newState.suppress) {
        queue.setPaused(false)
      }
      // Muted
      if (queue.playing && !oldState.serverMute && newState.serverMute) {
        queue.setPaused(true)
      } else if (queue.playing && oldState.serverMute && !newState.serverMute) {
        queue.setPaused(false)
      }
      return
    }

    // Channel empty
    if (queue.connection?.channel.members.size <= 1) {
      queue.channel.send(simpleEmbed('Left the voice channel because it was empty.'))
      return queue.stop()
    }
  }
}
