import * as voice from '@discordjs/voice'
import playdl from 'play-dl'
import { StreamConnection } from './StreamConnection.js'
import { errorEmbed, msToHMS } from '../utilities/utilities.js'
import { getData, getPreview, getTracks } from 'spotify-url-info'

export class Queue {
  constructor(player, guild) {
    this.player = player
    this.guild = guild
    this.connection = undefined
    this.tracks = []
    this.previousTracks = []
    this.playing = false
    this.repeatMode = 0
    this.queueVolume = 50
    this.channel = undefined
    this.destroyed = false
  }

  async join(channelId) {
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

    setTimeout(() => {
      if (!this.playing) { this.stop() }
    }, 30000)

    this.connection.on('start', () => {
      this.playing = true
      this.player.client.dashboard.update(this)
    })

    this.connection.on('end', () => {
      if (this.destroyed) { return }
      this.playing = false

      const oldSong = this.tracks.shift()
      this.previousTracks.push(oldSong)
      this.previousTracks = this.previousTracks.slice(-10)

      if (this.tracks.length === 0 && this.repeatMode === 0) {
        // Queue empty
        this.player.client.dashboard.update(this)
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

  async play(query, options) {
    if (this.destroyed) { throw new Error('Queue destroyed') }
    if (!this.connection) { throw new Error('Connection unavailable') }
    if (!query) { return null }

    if (options?.immediate) {
      query.seekTime = options?.seek ?? 0
      const stream = await playdl.stream(query.streamURL, { seek: query.seekTime / 1000 })
      const resource = this.connection.createAudioStream(stream)
      await this.connection.playAudioStream(resource).then(() => { this.connection.setVolume(this.queueVolume) })

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
          thumbnail: info.thumbnails.at(-1).url,
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

        const tracks = (await info.all_videos()).map((track) => ({
          title: track.title,
          author: track.channel.name,
          url: track.url,
          streamURL: track.url,
          thumbnail: track.thumbnails.at(-1).url,
          requestedBy: options?.requestedBy ?? 'null',
          duration: msToHMS(track.durationInSec * 1000),
          milliseconds: track.durationInSec * 1000,
          seekTime: 0,
          live: track.live,
          track: true
        }))

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
          streamURL: await getStreamURL(`${info.artist} ${info.title}`),
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

        // noinspection JSUnresolvedVariable
        const tracks = await Promise.all((await getTracks(query)).map(
          async (track) => ({
            title: track.artists[0].name + ' - ' + track.name,
            author: track.artists[0].name,
            url: track.external_urls.spotify,
            streamURL: await getStreamURL(`${track.artists[0].name} ${track.name}`),
            thumbnail: track.album?.images[0]?.url,
            requestedBy: options?.requestedBy ?? 'null',
            duration: msToHMS(track.duration_ms),
            milliseconds: track.duration_ms,
            seekTime: 0,
            live: false,
            track: true
          })
        ))

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

        const tracks = (await info.all_tracks()).map((track) => ({
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
        }))

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
        const info = (await playdl.search(query, { source: { youtube: 'video' }, limit: 1 }))[0]
        if (!info) { return null }
        added = {
          title: info.title,
          author: info.channel.name,
          url: info.url,
          streamURL: info.url,
          thumbnail: info.thumbnails.at(-1).url,
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

    this.player.client.dashboard.update(this)
    return added
  }

  async search(query, options) {
    if (this.destroyed) { throw new Error('Queue destroyed') }
    if (!query) { return null }

    const info = await playdl.search(query, { source: { youtube: 'video' }, limit: 5 })
    if (!info) { return null }

    return info.map((track) => ({
      title: track.title,
      author: track.channel.name,
      url: track.url,
      streamURL: track.url,
      thumbnail: track.thumbnails.at(-1).url,
      requestedBy: options?.requestedBy ?? 'null',
      duration: msToHMS(track.durationInSec * 1000),
      milliseconds: track.durationInSec * 1000,
      seekTime: 0,
      live: track.live,
      track: true
    }))
  }

  async seek(time) {
    if (this.destroyed) { throw new Error('Queue destroyed') }
    if (!this.playing) { throw new Error('Nothing playing') }

    if (time <= 0) { time = 0 }
    if (time >= this.nowPlaying.milliseconds) { return this.skip() }

    await this.play(this.nowPlaying, { immediate: true, seek: time })
    this.player.client.dashboard.update(this)
  }

  skip(index = 0) {
    if (this.destroyed) { throw new Error('Queue destroyed') }
    if (!this.connection) { throw new Error('Connection unavailable') }

    this.tracks.splice(1, index)
    this.connection.stop()
  }

  previous() {
    if (this.destroyed) { throw new Error('Queue destroyed') }
    if (!this.connection) { throw new Error('Connection unavailable') }

    if (this.previousTracks.length === 0) { return null }
    this.tracks.splice(1, 0, this.previousTracks.pop(), this.nowPlaying)
    this.connection.stop()
    return this.nowPlaying
  }

  stop() {
    if (this.destroyed) { return }
    this.player.client.dashboard.update({ guild: this.guild })
    this.destroyed = true
    this.connection?.leave()
    this.player.deleteQueue(this.guild.id)
  }

  shuffle() {
    if (this.destroyed) { throw new Error('Queue destroyed') }
    if (this.tracks.length <= 2) { return }
    for (let i = this.tracks.length - 1; i > 1; --i) {
      const j = 1 + Math.floor(Math.random() * i);
      [this.tracks[i], this.tracks[j]] = [this.tracks[j], this.tracks[i]]
    }
    this.player.client.dashboard.update(this)
  }

  remove(index) {
    const removed = this.tracks.splice(index, 1)[0]
    this.player.client.dashboard.update(this)
    return removed
  }

  clear() {
    if (this.destroyed) { throw new Error('Queue destroyed') }
    const nowPlaying = this.tracks.shift()
    this.tracks = [nowPlaying]
    this.player.client.dashboard.update(this)
  }

  createProgressBar(body, head) {
    if (this.destroyed) { throw new Error('Queue destroyed') }
    if (!this.playing) { throw new Error('Nothing playing') }
    const currentTime = this.currentTime
    const progress = Math.round(20 * currentTime / this.nowPlaying.milliseconds)
    const emptyProgress = 20 - progress
    return body.repeat(progress) + head + ' '.repeat(emptyProgress) + msToHMS(currentTime) + '/' + this.nowPlaying.duration
  }

  setRepeatMode(mode) {
    if (this.destroyed) { throw new Error('Queue destroyed') }
    this.repeatMode = mode
    this.player.client.dashboard.update(this)
  }

  setChannel(channel) {
    if (this.destroyed) { throw new Error('Queue destroyed') }
    if (!channel.isText()) { return }
    this.channel = channel
  }

  get nowPlaying() {
    if (this.destroyed) { throw new Error('Queue destroyed') }
    if (!this.connection) { throw new Error('Connection unavailable') }
    return this.tracks[0]
  }

  get currentTime() {
    if (this.destroyed) { throw new Error('Queue destroyed') }
    if (!this.connection) { throw new Error('Connection unavailable') }
    if (!this.playing) { throw new Error('Nothing playing') }
    return this.nowPlaying.seekTime + this.connection.time
  }

  get totalTime() {
    if (this.destroyed) { throw new Error('Queue destroyed') }
    if (!this.connection) { throw new Error('Connection unavailable') }
    if (!this.playing) { throw new Error('Nothing playing') }
    return this.tracks.length > 1 ? this.tracks.slice(1).map((track) => track.milliseconds).reduce((p, c) => p + c) : 0
  }

  setPaused(state) {
    if (this.destroyed) { throw new Error('Queue destroyed') }
    if (!this.connection) { throw new Error('Connection unavailable') }
    if (!this.playing) { throw new Error('Nothing playing') }
    this.connection.setPaused(state)
    this.player.client.dashboard.update(this)
  }

  get paused() {
    if (this.destroyed) { throw new Error('Queue destroyed') }
    if (!this.connection) { throw new Error('Connection unavailable') }
    if (!this.playing) { throw new Error('Nothing playing') }
    return this.connection.paused
  }

  setVolume(volume) {
    if (this.destroyed) { throw new Error('Queue destroyed') }
    if (!this.connection) { throw new Error('Connection unavailable') }
    this.queueVolume = volume
    this.connection.setVolume(volume)
    this.player.client.dashboard.update(this)
  }

  get volume() {
    if (this.destroyed) { throw new Error('Queue destroyed') }
    if (!this.connection) { throw new Error('Connection unavailable') }
    return this.connection.volume
  }
}

async function getStreamURL(query) {
  const videos = await playdl.search(query, { limit: 5 })
  return (
    videos.find((video) => video.channel.name.endsWith('- Topic'))?.url ??
    videos.find((video) => video.title.toLowerCase().includes('lyrics') || video.title.toLowerCase().includes('audio'))?.url ??
    videos.find((video) => video.channel.artist)?.url ??
    videos[0]?.url ??
    'https://youtu.be/Wch3gJG2GJ4'
  )
}
