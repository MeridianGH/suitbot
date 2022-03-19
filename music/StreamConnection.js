const voice = require('@discordjs/voice')
const { EventEmitter } = require('events')
const { sleep } = require('../utilities')
const { VoiceConnectionStatus } = require('@discordjs/voice')

module.exports = class StreamConnection extends EventEmitter {
  constructor (connection, channel) {
    super()
    this.connection = connection
    this.player = voice.createAudioPlayer()
    this.channel = channel
    this.resource = undefined
    this.paused = false
    this.readyLock = false

    this.connection.on('stateChange', async (oldState, newState) => {
      if (newState.status === voice.VoiceConnectionStatus.Disconnected) {
        if (newState.reason === voice.VoiceConnectionDisconnectReason.WebSocketClose && newState.closeCode === 4014) {
          try {
            // Attempting to re-join the voice channel, after possibly changing channels
            await voice.entersState(this.connection, voice.VoiceConnectionStatus.Connecting, 5000)
          } catch {
            // Manually disconnected, connection is closed in Player.js _voiceUpdate
          }
        } else if (this.connection.rejoinAttempts < 5) {
          await sleep((this.connection.rejoinAttempts + 1) * 5)
          this.connection.rejoin()
        } else {
          this.leave()
        }
      } else if (newState.status === voice.VoiceConnectionStatus.Destroyed) {
        this.stop()
      } else if (!this.readyLock && (newState.status === voice.VoiceConnectionStatus.Connecting || newState.status === voice.VoiceConnectionStatus.Signalling)) {
        this.readyLock = true
        try {
          await this._waitForReady()
        } catch {
          if (this.connection.state.status !== voice.VoiceConnectionStatus.Destroyed) { this.leave() }
        } finally {
          this.readyLock = false
        }
      }
    })

    this.player.on('stateChange', (oldState, newState) => {
      if (newState.status === voice.AudioPlayerStatus.Idle && oldState.status !== voice.AudioPlayerStatus.Idle) {
        if (!this.paused) {
          this.emit('end', this.resource)
          delete this.resource
        }
      } else if (newState.status === voice.AudioPlayerStatus.Playing) {
        if (!this.paused) {
          this.emit('start', this.resource)
        }
      }
    })
    this.player.on('error', data => {
      this.emit('error', data)
    })

    this.connection.subscribe(this.player)
  }

  createAudioStream (stream) {
    // noinspection JSCheckFunctionSignatures
    this.resource = voice.createAudioResource(stream.stream, { inputType: stream.type, inlineVolume: true })
    return this.resource
  }

  async playAudioStream (resource) {
    console.log('connection playAudioStream')
    if (!resource) { throw new Error('No resource available') }
    if (!this.resource) { this.resource = resource }

    if (this.connection.state.status !== VoiceConnectionStatus.Ready) { await this._waitForReady() }

    this.player.play(resource)
  }

  setPaused (state) {
    console.log('connection setPaused')
    if (state) {
      this.player.pause()
      this.paused = true
      return true
    } else {
      this.player.unpause()
      this.paused = false
      return false
    }
  }

  stop () {
    console.log('connection stop')
    this.player.stop()
  }

  leave () {
    console.log('connection leave')
    this.player.stop()
    this.connection.destroy()
  }

  setVolume (volume) {
    console.log('connection setVolume', volume)
    if (!this.resource) { throw new Error('No resource available') }
    this.resource.volume.setVolumeLogarithmic(volume / 100)
  }

  get volume () {
    if (!this.resource?.volume) { return 50 }
    return Math.round(Math.pow(this.resource.volume.volume, 1 / 1.661) * 100)
  }

  get time () {
    if (!this.resource) { return 0 }
    return this.resource.playbackDuration
  }

  async _waitForReady () {
    await voice.entersState(this.connection, voice.VoiceConnectionStatus.Ready, 20000)
  }
}
