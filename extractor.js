// noinspection JSUnusedGlobalSymbols

const playdl = require('play-dl')
const { getData, getPreview, getTracks } = require('spotify-url-info')

module.exports = {
  important: true,
  validate: () => true,
  getInfo: async (query) => {
    try {
      // Setup cookies and soundcloud client
      await playdl.setToken({ youtube: { cookie: process.env.cookie ?? require('./config.json').cookie }, soundcloud: { client_id: await playdl.getFreeClientID() } })

      // Remove URL parameters
      if (query.startsWith('https')) { query = query.split('&')[0] }

      // YouTube
      const youtubeType = playdl.yt_validate(query)
      if (youtubeType === 'video') {
        // YouTube Link
        const info = await playdl.search(query, { limit: 1, unblurNSFWThumbnails: true })
        if (!info || !info.length) { return { playlist: null, info: null } }

        const track = {
          title: info[0].title,
          duration: info[0].durationInSec * 1000,
          thumbnail: info[0].thumbnails[0]?.url,
          async engine () { return (await playdl.stream(`https://youtu.be/${info[0].id}`, { discordPlayerCompatibility: true })).stream },
          views: info[0].views,
          author: info[0].channel.name,
          description: '',
          url: `https://youtu.be/${info[0].id}`,
          source: 'youtube-custom'
        }

        return { playlist: null, info: [track] }
      } else if (youtubeType === 'playlist') {
        // YouTube Playlist
        const info = await playdl.playlist_info(query, { incomplete: true })

        const trackList = await info.all_videos()
        const tracks = trackList.map(track => {
          return {
            title: track.title,
            duration: track.durationInSec * 1000,
            thumbnail: track.thumbnails[0]?.url,
            async engine () { return (await playdl.stream(track.url, { discordPlayerCompatibility: true })).stream },
            views: track.views,
            author: track.channel.name,
            description: '',
            url: track.url,
            source: 'youtube-custom'
          }
        })

        const playlist = {
          title: info.title,
          description: '',
          thumbnail: info.thumbnail?.url,
          type: 'playlist',
          source: 'youtube-custom',
          author: info.channel.name,
          id: info.id,
          url: info.url,
          rawPlaylist: info
        }

        return { playlist: playlist, info: tracks }
      }

      // Spotify
      const spotifyType = playdl.sp_validate(query)
      if (spotifyType === 'track') {
        const info = await getPreview(query)

        const track = {
          title: info.artist + ' - ' + info.title,
          duration: (await getData(query)).duration_ms,
          thumbnail: info.image,
          async engine () { return (await playdl.stream(await playdl.search(`${info.artist} ${info.title} lyrics`, { limit: 1, unblurNSFWThumbnails: true }).then(result => result[0] ? `https://youtu.be/${result[0].id}` : 'https://youtu.be/Wch3gJG2GJ4'), { discordPlayerCompatibility: true })).stream },
          views: 0,
          author: info.artist,
          description: '',
          url: info.link,
          source: 'spotify-custom'
        }

        return { playlist: null, info: [track] }
      } else if (spotifyType === 'playlist' || spotifyType === 'album') {
        const info = await getPreview(query)

        const trackList = await getTracks(query)
        const tracks = trackList.map(track => {
          // noinspection JSUnresolvedVariable
          return {
            title: track.artists[0].name + ' - ' + track.name,
            duration: track.duration_ms,
            thumbnail: track.album?.images[0]?.url,
            async engine () { return (await playdl.stream(await playdl.search(`${track.artists[0].name} ${track.name} lyrics`, { limit: 1, unblurNSFWThumbnails: true }).then(result => result[0] ? `https://youtu.be/${result[0].id}` : 'https://youtu.be/Wch3gJG2GJ4'), { discordPlayerCompatibility: true })).stream },
            views: 0,
            author: track.artists[0].name,
            description: '',
            url: track.external_urls.spotify,
            source: 'spotify-custom'
          }
        })

        const playlist = {
          title: info.title,
          description: '',
          thumbnail: info.image,
          type: info.type === 'album' ? 'album' : 'playlist',
          source: 'spotify-custom',
          author: info.artist,
          id: null,
          url: info.link,
          rawPlaylist: info
        }

        return { playlist: playlist, info: tracks }
      }

      // Soundcloud
      const soundcloudType = await playdl.so_validate(query)
      if (soundcloudType === 'track') {
        // Soundcloud track
        const info = await playdl.soundcloud(query)

        const track = {
          title: info.name,
          duration: info.durationInMs,
          thumbnail: info.thumbnail,
          async engine () { return (await playdl.stream(info.url, { discordPlayerCompatibility: true })).stream },
          views: 0,
          author: info.publisher?.name ?? info.publisher?.artist ?? info.publisher?.writer_composer ?? 'Soundcloud',
          description: '',
          url: info.permalink,
          source: 'soundcloud-custom'
        }

        return { playlist: null, info: [track] }
      } else if (soundcloudType === 'playlist') {
        // Soundcloud playlist
        const info = await playdl.soundcloud(query)

        const trackList = await info.all_tracks()
        const tracks = trackList.map(track => {
          return {
            title: track.name,
            duration: track.durationInMs,
            thumbnail: track.thumbnail,
            async engine () { return (await playdl.stream(track.url, { discordPlayerCompatibility: true })).stream },
            views: 0,
            author: track.publisher?.name ?? track.publisher?.artist ?? track.publisher?.writer_composer ?? 'Soundcloud',
            description: '',
            url: track.permalink,
            source: 'soundcloud-custom'
          }
        })

        const playlist = {
          title: info.name,
          description: '',
          thumbnail: info.tracks[0].thumbnail,
          type: 'playlist',
          source: 'soundcloud-custom',
          author: info.user,
          id: info.id,
          url: `${info.user.url}/sets/${info.name}`,
          rawPlaylist: info
        }

        return { playlist: playlist, info: tracks }
      }

      // YouTube Query Search
      const search = await playdl.search(query, { limit: 5, unblurNSFWThumbnails: true })
      if (search && search.length) {
        const tracks = search.map(track => {
          return {
            title: track.title,
            duration: track.durationInSec * 1000,
            thumbnail: track.thumbnails[0]?.url,
            async engine () { return (await playdl.stream(`https://youtu.be/${track.id}`, { discordPlayerCompatibility: true })).stream },
            views: track.views,
            author: track.channel.name,
            description: '',
            url: `https://youtu.be/${track.id}`,
            source: 'youtube-custom'
          }
        })

        return { playlist: null, info: tracks }
      }

      return { playlist: null, info: null }
    } catch {
      console.log(`Extractor: An error occurred while attempting to resolve ${query}`)
      return { playlist: null, info: null }
    }
  }
}
