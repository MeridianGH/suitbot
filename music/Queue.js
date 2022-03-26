const voice = require('@discordjs/voice')
const playdl = require('play-dl')
const StreamConnection = require('./StreamConnection')
const { errorEmbed, msToHMS } = require('../utilities')
const { getPreview, getData, getTracks } = require('spotify-url-info')

module.exports = class Queue {
  constructor (player, guild) {
    this.player = player
    this.guild = guild
    this.connection = undefined
    this.tracks = []
    this.previous = []
    this.playing = false
    this.repeatMode = 0
    this.queueVolume = 50
    this.channel = undefined
    this.destroyed = false
  }

  async join (channelId) {
    if (this.destroyed) { return }
    if (this.connection) { return }

    const channel = this.guild.channels.resolve(channelId)
    if (!channel) { return }
    if (!channel.isVoice()) { return }

    let connection = voice.joinVoiceChannel({
      guildId: channel.guild.id,
      channelId: channel.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
      selfDeaf: false
    })

    let streamConnection
    try {
      connection = await voice.entersState(connection, voice.VoiceConnectionStatus.Ready, 15000)
      streamConnection = new StreamConnection(connection, channel)
    } catch {
      connection.destroy()
      return
    }
    this.connection = streamConnection

    if (channel.type === 'GUILD_STAGE_VOICE') {
      await channel.guild.me.voice.setSuppressed(false).catch(async () => {
        await channel.guild.me.voice.setRequestToSpeak(true)
      })
    }

    this.connection.on('start', () => {
      this.playing = true
    })

    this.connection.on('end', () => {
      if (this.destroyed) { return }
      this.playing = false

      const oldSong = this.tracks.shift()
      this.previous.push(oldSong)
      this.previous = this.previous.slice(1, 11)

      if (this.tracks.length === 0 && this.repeatMode === 0) {
        // Queue empty
        setTimeout(() => { if (!this.playing) { this.stop() } }, 30000)
        return
      } else if (this.repeatMode === 1) {
        // Repeat track
        this.tracks.unshift(oldSong)
      } else if (this.repeatMode === 2) {
        // Repeat queue
        this.tracks.push(oldSong)
      }

      this.play(this.tracks[0], { immediate: true })
    })

    this.connection.on('error', (error) => { this.channel?.send(errorEmbed('Error', error)) })
  }

  async play (query, options) {
    if (this.destroyed) { throw new Error('Queue destroyed') }
    if (!this.connection) { throw new Error('Connection unavailable') }
    if (!query) { return null }

    if (options?.immediate) {
      query.seekTime = options?.seek ?? 0
      const stream = await playdl.stream(query.streamURL, { seek: query.seekTime / 1000 })
      const resource = this.connection.createAudioStream(stream)
      await this.connection.playAudioStream(resource).then(() => { this.setVolume(this.queueVolume) })

      return query
    }

    let added = query
    const isFirst = this.tracks.length === 0
    if (query.track) {
      this.tracks.push(query)
    } else if (query.playlist) {
      this.tracks.push(...query.tracks)
    } else {
      added = null
      if (query.startsWith('https')) { query = query.split('&')[0] }

      const youtubeType = playdl.yt_validate(query)
      if (youtubeType === 'video' && query.startsWith('https')) {
        const info = (await playdl.search(query, { limit: 1 }))[0]
        if (!info) { return null }

        added = {
          title: info.title,
          author: info.channel.name,
          url: info.url,
          streamURL: info.url,
          thumbnail: `https://i.ytimg.com/vi/${info.id}/maxresdefault.jpg`,
          requestedBy: options?.requestedBy ?? 'null',
          duration: msToHMS(info.durationInSec * 1000),
          milliseconds: info.durationInSec * 1000,
          seekTime: 0,
          live: info.live,
          track: true
        }
        this.tracks.push(added)
      }
      if (youtubeType === 'playlist') {
        const info = await playdl.playlist_info(query, { incomplete: true })
        if (!info) { return null }

        const tracks = (await info.all_videos()).map(track => {
          return {
            title: track.title,
            author: track.channel.name,
            url: track.url,
            streamURL: track.url,
            thumbnail: `https://i.ytimg.com/vi/${track.id}/maxresdefault.jpg`,
            requestedBy: options?.requestedBy ?? 'null',
            duration: msToHMS(track.durationInSec * 1000),
            milliseconds: track.durationInSec * 1000,
            seekTime: 0,
            live: track.live,
            track: true
          }
        })

        added = {
          title: info.title,
          author: info.channel.name,
          url: info.url,
          thumbnail: tracks[0].thumbnail,
          playlist: true,
          tracks: tracks
        }
        this.tracks.push(...tracks)
      }

      const spotifyType = playdl.sp_validate(query)
      if (spotifyType === 'track') {
        const info = await getPreview(query)
        if (!info) { return null }
        const data = await getData(query)

        added = {
          title: info.artist + ' - ' + info.title,
          author: info.artist,
          url: info.link,
          streamURL: await playdl.search(`${info.artist} ${info.title} lyrics`, { limit: 1 }).then(result => result[0] ? `https://youtu.be/${result[0].id}` : 'https://youtu.be/Wch3gJG2GJ4'),
          thumbnail: info.image,
          requestedBy: options?.requestedBy ?? 'null',
          duration: msToHMS(data.duration_ms),
          milliseconds: data.duration_ms,
          seekTime: 0,
          live: false,
          track: true
        }
        this.tracks.push(added)
      }
      if (spotifyType === 'playlist' || spotifyType === 'album') {
        const info = await getPreview(query)
        if (!info) { return null }

        const tracks = (await getTracks(query)).map(async track => {
          // noinspection JSUnresolvedVariable
          return {
            title: track.artists[0].name + ' - ' + track.name,
            author: track.artists[0].name,
            url: track.external_urls.spotify,
            streamURL: await playdl.search(`${track.artists[0].name} ${track.name} lyrics`, { limit: 1 }).then(result => result[0] ? `https://youtu.be/${result[0].id}` : 'https://youtu.be/Wch3gJG2GJ4'),
            thumbnail: track.album?.images[0]?.url,
            requestedBy: options?.requestedBy ?? 'null',
            duration: msToHMS(track.duration_ms),
            milliseconds: track.duration_ms,
            seekTime: 0,
            live: false,
            track: true
          }
        })

        added = {
          title: info.title,
          author: info.artist,
          url: info.link,
          thumbnail: info.image,
          playlist: true,
          tracks: tracks
        }
        this.tracks.push(...tracks)
      }

      const soundcloudType = await playdl.so_validate(query)
      if (soundcloudType === 'track') {
        const info = await playdl.soundcloud(query)
        if (!info) { return null }

        added = {
          title: info.name,
          author: info.publisher?.name ?? info.publisher?.artist ?? info.publisher?.writer_composer ?? 'Soundcloud',
          url: info.permalink,
          streamURL: info.url,
          thumbnail: info.thumbnail,
          requestedBy: options?.requestedBy ?? 'null',
          duration: msToHMS(info.durationInMs),
          milliseconds: info.durationInMs,
          seekTime: 0,
          live: false,
          track: true
        }
        this.tracks.push(added)
      }
      if (soundcloudType === 'playlist') {
        const info = await playdl.soundcloud(query)
        if (!info) { return null }

        const tracks = (await info.all_tracks()).map(track => {
          return {
            title: track.name,
            author: track.publisher?.name ?? track.publisher?.artist ?? track.publisher?.writer_composer ?? 'Soundcloud',
            url: info.permalink,
            streamURL: info.url,
            thumbnail: info.thumbnail,
            requestedBy: options?.requestedBy ?? 'null',
            duration: msToHMS(info.durationInMs),
            milliseconds: info.durationInMs,
            seekTime: 0,
            live: false,
            track: true
          }
        })

        added = {
          title: info.name,
          author: info.user,
          url: info.permalink,
          thumbnail: tracks[0].thumbnail,
          playlist: true,
          tracks: tracks
        }
        this.tracks.push(...tracks)
      }

      if (youtubeType === 'search') {
        const info = (await playdl.search(query, { limit: 1 }))[0]
        if (!info) { return null }
        added = {
          title: info.title,
          author: info.channel.name,
          url: info.url,
          streamURL: info.url,
          thumbnail: `https://i.ytimg.com/vi/${info.id}/maxresdefault.jpg`,
          requestedBy: options?.requestedBy ?? 'null',
          duration: msToHMS(info.durationInSec * 1000),
          milliseconds: info.durationInSec * 1000,
          seekTime: 0,
          live: info.live,
          track: true
        }
        this.tracks.push(added)
      }
    }

    if (isFirst) {
      const track = this.tracks[0]
      const stream = await playdl.stream(track.streamURL)
      const resource = this.connection.createAudioStream(stream)
      await this.connection.playAudioStream(resource).then(() => { this.setVolume(this.queueVolume) })
    }

    return added
  }

  // TODO: Search command that returns five songs

  async seek (time) {
    if (this.destroyed) { throw new Error('Queue destroyed') }
    if (!this.playing) { throw new Error('Nothing playing') }

    if (time <= 0) { time = 0 }
    if (time >= this.nowPlaying.milliseconds) { return this.skip() }

    await this.play(this.nowPlaying, { immediate: true, seek: time })
  }

  skip (index = 0) {
    if (this.destroyed) { throw new Error('Queue destroyed') }
    if (!this.connection) { throw new Error('Connection unavailable') }

    this.tracks.splice(1, index)
    this.connection.stop()
  }

  stop () {
    if (this.destroyed) { return }
    this.destroyed = true
    this.connection?.leave()
    this.player.deleteQueue(this.guild.id)
  }

  shuffle () {
    if (this.destroyed) { throw new Error('Queue destroyed') }
    if (this.tracks.length <= 2) { return }
    for (let i = this.tracks.length - 1; i > 1; --i) {
      const j = 1 + Math.floor(Math.random() * i);
      [this.tracks[i], this.tracks[j]] = [this.tracks[j], this.tracks[i]]
    }
  }

  remove (index) {
    return this.tracks.splice(index, 1)[0]
  }

  clear () {
    if (this.destroyed) { throw new Error('Queue destroyed') }
    const nowPlaying = this.tracks.shift()
    this.tracks = [nowPlaying]
  }

  createProgressBar (body, head) {
    if (this.destroyed) { throw new Error('Queue destroyed') }
    if (!this.playing) { throw new Error('Nothing playing') }
    const currentTime = this.currentTime
    const progress = Math.round(20 * currentTime / this.nowPlaying.milliseconds)
    const emptyProgress = 20 - progress
    return body.repeat(progress) + head + ' '.repeat(emptyProgress) + msToHMS(currentTime) + '/' + this.nowPlaying.duration
  }

  setRepeatMode (mode) {
    if (this.destroyed) { throw new Error('Queue destroyed') }
    this.repeatMode = mode
  }

  setChannel (channel) {
    if (this.destroyed) { throw new Error('Queue destroyed') }
    if (!channel.isText()) { return }
    this.channel = channel
  }

  get nowPlaying () {
    if (this.destroyed) { throw new Error('Queue destroyed') }
    if (!this.connection) { throw new Error('Connection unavailable') }
    return this.tracks[0]
  }

  get currentTime () {
    if (this.destroyed) { throw new Error('Queue destroyed') }
    if (!this.connection) { throw new Error('Connection unavailable') }
    if (!this.playing) { throw new Error('Nothing playing') }
    return this.nowPlaying.seekTime + this.connection.time
  }

  get totalTime () {
    if (this.destroyed) { throw new Error('Queue destroyed') }
    if (!this.connection) { throw new Error('Connection unavailable') }
    if (!this.playing) { throw new Error('Nothing playing') }
    return this.tracks.length > 1 ? this.tracks.slice(1).map(track => track.milliseconds).reduce((p, c) => p + c) : 0
  }

  setPaused (state) {
    if (this.destroyed) { throw new Error('Queue destroyed') }
    if (!this.connection) { throw new Error('Connection unavailable') }
    if (!this.playing) { throw new Error('Nothing playing') }
    return this.connection.setPaused(state)
  }

  get paused () {
    if (this.destroyed) { throw new Error('Queue destroyed') }
    if (!this.connection) { throw new Error('Connection unavailable') }
    if (!this.playing) { throw new Error('Nothing playing') }
    return this.connection.paused
  }

  setVolume (volume) {
    if (this.destroyed) { throw new Error('Queue destroyed') }
    if (!this.connection) { throw new Error('Connection unavailable') }
    this.queueVolume = volume
    return this.connection.setVolume(volume)
  }

  get volume () {
    if (this.destroyed) { throw new Error('Queue destroyed') }
    if (!this.connection) { throw new Error('Connection unavailable') }
    return this.connection.volume
  }
}
