// noinspection JSUnresolvedVariable

import { spawn } from 'child_process'
import { Manager } from 'erela.js'
import { ExtendedSearch } from './ExtendedSearch.js'
import { objectDifference, simpleEmbed } from '../utilities/utilities.js'
import { FilterManager } from './FilterManager.js'
import yaml from 'js-yaml'
import fs from 'fs'
import { papisid, psid } from '../utilities/config.js'

export class Lavalink {
  constructor(client) {
    this.client = client
    this.manager = new Manager({
      nodes: [
        {
          host: 'localhost',
          port: 2333,
          password: 'youshallnotpass'
        }
      ],
      plugins: [
        new ExtendedSearch(),
        new FilterManager()
      ],
      send(id, payload) {
        // noinspection JSIgnoredPromiseFromCall
        client.guilds.cache.get(id)?.shard.send(payload)
      }
    })
      .on('nodeConnect', (node) => { console.log(`Node ${node.options.identifier} connected`) })
      .on('nodeError', (node, error) => { console.log(`Node ${node.options.identifier} had an error: ${error.message}`) })
      .on('trackStart', (player) => {
        this.client.dashboard.update(player)
      })
      .on('trackEnd', (player, track) => {
        player.previousTracks = player.previousTracks ?? []
        player.previousTracks.push(track)
        player.previousTracks = player.previousTracks.slice(-11)
      })
      .on('queueEnd', (player) => {
        this.client.dashboard.update(player)
        setTimeout(() => { if (!player.playing) { player.destroy() } }, 30000)
      })

    this.client.once('ready', () => this.manager.init(this.client.user.id))
    this.client.on('raw', (d) => this.manager.updateVoiceState(d))
    this.client.on('voiceStateUpdate', (oldState, newState) => this._voiceUpdate(oldState, newState))
  }

  initialize() {
    const doc = yaml.load(fs.readFileSync('./music/lavalink/template.yml'), {})
    doc.lavalink.server.youtubeConfig.PAPISID = papisid
    doc.lavalink.server.youtubeConfig.PSID = psid
    fs.writeFileSync('./music/lavalink/application.yml', yaml.dump(doc, {}))

    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        console.log('Failed to start Lavalink within 10s.')
        process.exit()
      }, 10000)

      const lavalink = spawn('cd ./music/lavalink && java -jar Lavalink.jar', { shell: true })
      const onData = (data) => {
        data = data.toString().trim()
        if (data.includes('Undertow started')) {
          console.log('Successfully started Lavalink.')
          lavalink.stdout.removeListener('data', onData)
          clearTimeout(timeout)
          resolve()
        } else if (data.toLowerCase().includes('failed')) {
          console.log('Failed to start Lavalink.')
          lavalink.stdout.removeListener('data', onData)
          clearTimeout(timeout)
          process.exit()
        }
      }
      lavalink.stdout.on('data', onData)

      process.on('SIGTERM', () => { lavalink.kill() })
      process.on('SIGINT', () => { lavalink.kill() })
    })
  }

  _voiceUpdate(oldState, newState) {
    const player = this.manager.get(newState.guild.id)
    if (!player) { return }

    // Client events
    if (newState.guild.members.me.id === newState.member.id) {
      // Disconnect

      // TODO: Do something about the voiceState bug
      // See also: https://github.com/discord/discord-api-docs/issues/5351
      // Use this to debug:
      // console.log(objectDifference(oldState, newState))
      if (!newState.channelId) { return player.destroy() }

      // Muted
      if (oldState.serverMute !== newState.serverMute) { player.pause(newState.serverMute) }

      // Stage Channel
      if (newState.channel.type === 'GUILD_STAGE_VOICE') {
        // Join
        if (!oldState.channel) {
          return newState.guild.members.me.voice.setSuppressed(false).catch(async () => {
            player.pause(true)
            await newState.guild.members.me.voice.setRequestToSpeak(true)
          })
        }
        // Suppressed
        if (oldState.suppress !== newState.suppress) {
          return player.pause(newState.suppress)
        }
      }
      return
    }

    // Channel empty
    if (oldState?.guild.channels.cache.get(player.voiceChannel).members.size <= 1) {
      oldState?.guild.channels.cache.get(player.textChannel).send(simpleEmbed('Left the voice channel because it was empty.'))
      return player.destroy()
    }
  }

  getPlayer(guildId) {
    return this.manager.get(guildId)
  }

  createPlayer(interaction) {
    return this.manager.create({ guild: interaction.guild.id, voiceChannel: interaction.member.voice.channel.id, textChannel: interaction.channel.id, volume: 50 })
  }
}
