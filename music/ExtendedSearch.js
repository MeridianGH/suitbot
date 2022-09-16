import { Plugin } from 'erela.js'
import spotifyUrlInfo from 'spotify-url-info'
import fetch from 'isomorphic-unfetch'
import ytpl from 'ytpl'

const spotify = spotifyUrlInfo(fetch)

const buildResult = (loadType, tracks, error, playlist) => ({
  loadType,
  tracks: tracks ?? [],
  playlist: playlist ? { ...playlist, duration: tracks.reduce((acc, cur) => acc + (cur.duration || 0), 0) } : null,
  exception: error ? { message: error, severity: 'COMMON' } : null
})

export class ExtendedSearch extends Plugin {
  constructor() {
    super()
  }

  load(manager) {
    this.manager = manager
    this._search = manager.search.bind(manager)
    manager.search = this.search.bind(this)
  }

  async search(query, requestedBy) {
    query = query.query ?? query

    // Split off query parameters
    if (query.startsWith('https://')) { query = query.split('&')[0] }

    // YouTube Shorts
    const shortsRegex = /https:\/\/(www\.)?youtube\.com\/shorts\/(.*)$/
    if (query.match(shortsRegex)) { query = query.replace('shorts/', 'watch?v=') }

    // YouTube Playlists
    const playlistRegex = /https:\/\/(www\.)?youtube\.com\/playlist(.*)$/
    if (query.match(playlistRegex)) {
      try {
        const data = ytpl.validateID(query) ? await ytpl(query) : null
        const result = await this._search(query, requestedBy)
        result.playlist = Object.assign(result.playlist, { name: data.title, author: data.author.name, thumbnail: data.bestThumbnail.url, uri: data.url })
        return result
      } catch (e) {
        return buildResult('LOAD_FAILED', null, e.message ?? null, null)
      }
    }

    // Spotify
    const spotifyRegex = /(?:https:\/\/open\.spotify\.com\/|spotify:)(?:.+)?(track|playlist|album)[/:]([A-Za-z0-9]+)/
    const type = query.match(spotifyRegex)?.[1]
    try {
      switch (type) {
        case 'track': {
          const data = await this.getTrack(query, requestedBy)
          return buildResult('TRACK_LOADED', data.tracks, null, null)
        }
        case 'playlist': {
          const data = await this.getPlaylist(query, requestedBy)
          return buildResult('PLAYLIST_LOADED', data.tracks, null, data.playlist)
        }
        case 'album': {
          const data = await this.getAlbumTracks(query, requestedBy)
          return buildResult('PLAYLIST_LOADED', data.tracks, null, data.playlist)
        }
      }
    } catch (e) {
      return buildResult('LOAD_FAILED', null, e.message ?? null, null)
    }

    // Use best thumbnail available
    const search = await this._search(query, requestedBy)
    for (const track of search.tracks) { track.thumbnail = await this.getBestThumbnail(track) }

    return search
  }

  async getTrack(query, requestedBy) {
    const data = await spotify.getData(query)
    const track = {
      author: data.artists[0].name,
      duration: data.duration_ms,
      thumbnail: data.album?.images[0]?.url,
      title: data.artists[0].name + ' - ' + data.name,
      uri: data.external_urls.spotify
    }
    return { tracks: [ await this.findClosestTrack(track, requestedBy) ] }
  }

  async getPlaylist(query, requestedBy) {
    const data = await spotify.getData(query)
    const tracks = await Promise.all(data.tracks.items.map(
      async (playlistTrack) => await this.findClosestTrack({
        author: playlistTrack.track.artists[0].name,
        duration: playlistTrack.track.duration_ms,
        thumbnail: playlistTrack.track.album?.images[0]?.url,
        title: playlistTrack.track.artists[0].name + ' - ' + playlistTrack.track.name,
        uri: playlistTrack.track.external_urls.spotify
      }, requestedBy))
    )
    // noinspection JSUnresolvedVariable
    return { tracks, playlist: { name: data.name, author: data.owner.display_name, thumbnail: data.images[0]?.url, uri: data.external_urls.spotify } }
  }

  async getAlbumTracks(query, requestedBy) {
    const data = await spotify.getData(query)
    const tracks = await Promise.all(data.tracks.items.map(
      async (track) => await this.findClosestTrack({
        author: track.artists[0].name,
        duration: track.duration_ms,
        thumbnail: track.album?.images[0]?.url,
        title: track.artists[0].name + ' - ' + track.name,
        uri: track.external_urls.spotify
      }, requestedBy))
    )
    // noinspection JSUnresolvedVariable
    return { tracks, playlist: { name: data.name, author: data.artists[0].name, thumbnail: data.images[0]?.url, uri: data.external_urls.spotify } }
  }

  async findClosestTrack(data, requestedBy, retries = 5) {
    if (retries <= 0) { return }
    const tracks = (await this.manager.search(data.title, requestedBy)).tracks.slice(0, 5)
    const track =
      tracks.find((track) => track.author.endsWith('- Topic') || track.author === data.author) ??
      tracks.find((track) => track.title.toLowerCase().includes('official audio')) ??
      tracks.find((track) => track.duration >= data.duration - 1500 && track.duration <= data.duration + 1500) ??
      tracks[0]
    if (!track) { return await this.findClosestTrack(data, requestedBy, retries - 1) }
    const { author, title, thumbnail, uri } = data
    Object.assign(track, { author, title, thumbnail, uri })
    return track
  }

  async getBestThumbnail(track) {
    for (const size of ['maxresdefault', 'hqdefault', 'mqdefault', 'default']) {
      const thumbnail = track.displayThumbnail(size)
      if (!thumbnail) { continue }
      if ((await fetch(thumbnail)).ok) { return thumbnail }
    }
    return track.thumbnail
  }
}
