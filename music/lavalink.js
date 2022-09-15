// noinspection JSUnresolvedVariable

import { spawn } from 'child_process'
import { Manager } from 'erela.js'
import { ExtendedSearch } from './ExtendedSearch.js'
import { objectDifference, simpleEmbed } from '../utilities/utilities.js'
import { FilterManager } from './FilterManager.js'
import yaml from 'js-yaml'
import fs from 'fs'
import { papisid, psid } from '../utilities/config.js'
import http from 'http'
import { logging } from '../utilities/logging.js'

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
      .on('nodeConnect', (node) => { logging.info(`Node ${node.options.identifier} connected`) })
      .on('nodeError', (node, error) => { logging.error(`Node ${node.options.identifier} had an error: ${error.message}`) })
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

  async initialize() {
    const doc = yaml.load(fs.readFileSync('./music/lavalink/template.yml'), {})
    doc.lavalink.server.youtubeConfig.PAPISID = papisid
    doc.lavalink.server.youtubeConfig.PSID = psid
    fs.writeFileSync('./music/lavalink/application.yml', yaml.dump(doc, {}))

    if (await this._portInUse(doc.server.port)) {
      logging.warn(`A server (possibly Lavalink) is already active on port ${doc.server.port}.`)
      logging.warn('Continuing, but expect errors if the server already running isn\'t Lavalink.')
      return
    }

    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        logging.error('Failed to start Lavalink within 30s.')
        process.exit()
      }, 30000)

      const lavalink = spawn('cd ./music/lavalink && java -jar Lavalink.jar', { shell: true })
      const onData = (data) => {
        data = data.toString().trim()
        if (data.includes('Undertow started')) {
          logging.success('Successfully started Lavalink.')
          lavalink.stdout.removeListener('data', onData)
          clearTimeout(timeout)
          resolve()
        } else if (data.toLowerCase().includes('failed')) {
          logging.error('Failed to start Lavalink.')
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

  _portInUse(port) {
    return new Promise((resolve) => {
      const server = http.createServer()
      server.listen(port, () => {
        server.close()
        resolve(false)
      })
      server.on('error', () => { resolve(true) })
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
