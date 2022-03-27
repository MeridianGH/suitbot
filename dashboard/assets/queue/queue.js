const html = htm.bind(React.createElement)

const websocket = new WebSocket('ws://localhost')
function send (data) {
  data.guildId = guildId
  data.userId = userId
  websocket.send(JSON.stringify(data))
}

const loader = document.getElementById('loader')

'use strict'

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = null
  }

  componentDidMount () {
    websocket.addEventListener('open', () => {
      send({ type: 'request' })
    })
    websocket.addEventListener('message', message => {
      loader.remove()
      this.setState(JSON.parse(message.data))
    })

    this.interval = setInterval(() => {
      if (this.state && this.state.nowPlaying && !this.state.paused && !this.state.nowPlaying.live) {
        this.setState((state) => {
          if (state.currentTime >= state.nowPlaying.milliseconds) {
            clearInterval(this.interval)
            return { currentTime: (state.currentTime = state.nowPlaying.milliseconds) }
          }
          return { currentTime: (state.currentTime += 1000) }
        })
      }
    }, 1000)
  }

  componentWillUnmount () {
    clearInterval(this.interval)
  }

  render () {
    if (!this.state) { return null }
    if (!this.state.nowPlaying) { return html`<div>Nothing currently playing!<br />Join a voice channel and type "/play" to get started!</div>` }
    return html`
      <div>
        <${MediaSession} track=${this.state.nowPlaying} paused=${this.state.paused} />
        <${NowPlaying} track=${this.state.nowPlaying} paused=${this.state.paused} currentTime=${this.state.currentTime} repeatMode=${this.state.repeatMode} volume=${this.state.volume} />
          <div style=${{ marginBottom: '20px' }} />
        <${Queue} tracks=${this.state.tracks} />
      </div>
    `
  }
}

function NowPlaying (props) {
  const msToHMS = (ms) => {
    let totalSeconds = (ms / 1000)
    const hours = Math.floor(totalSeconds / 3600).toString()
    totalSeconds %= 3600
    const minutes = Math.floor(totalSeconds / 60).toString()
    const seconds = Math.floor(totalSeconds % 60).toString()
    return (hours === '0' ? `${minutes}:${seconds.padStart(2, '0')}` : `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`)
  }
  return html`
    <h1 className='queue-title'>Now Playing</h1>
    <div className='nowplaying-container'>
      <ul className='horizontal-list'>
        <li>
          <${Thumbnail} image=${props.track.thumbnail} />
          <div className='progress-container'>
            <div className='progress' style=${{ width: `${props.track.live ? '100%' : props.currentTime / props.track.milliseconds * 100 + '%'}` }} />
          </div>
        </li>
        <li>
          <a href=${props.track.url} rel='noreferrer' target='_blank'><h4>${props.track.title}</h4></a>
          <h6>${props.track.author}</h6>
          <h5>${props.track.live ? '🔴 Live' : `${msToHMS(props.currentTime)} / ${props.track.duration}`}</h5>
          <${MusicControls} paused=${props.paused} repeatMode=${props.repeatMode} />
        </li>
      </ul>
    </div>
    <${VolumeControl} volume=${props.volume} />
  `
}

function Thumbnail (props) {
  return html`
    <div className='thumbnail-container'>
      <img className='thumbnail-backdrop' src=${props.image} />
      <img className='thumbnail' src=${props.image} />
    </div>
  `
}

function MusicControls (props) {
  return html`
    <div>
      <button className='button square' onClick=${() => { send({ type: 'previous' }) }}><i className='fas fa-backward' /></button>
      <button className='button square' onClick=${() => { send({ type: 'pause' }) }}><i className=${props.paused ? 'fas fa-play' : 'fas fa-pause'} /></button>
      <button className='button square' onClick=${() => { send({ type: 'skip' }) }}><i className='fas fa-forward' /></button>
      <span style=${{ marginRight: '10px' }}></span>
      <button className='button square' onClick=${() => { send({ type: 'shuffle' }) }}><i className='fas fa-random' /></button>
      <button className='button square' onClick=${() => { send({ type: 'repeat' }) }}><i className=${props.repeatMode === 0 ? 'fad fa-repeat-alt' : props.repeatMode === 1 ? 'fas fa-repeat-1-alt' : 'fas fa-repeat'} /></button>
    </div>
  `
}

function VolumeControl (props) {
  const [volume, setVolume] = React.useState(props.volume)

  return html`
    <div>
      <button className='volume-display' disabled><i className=${volume === 0 ? 'fas fa-volume-off' : volume <= 33 ? 'fas fa-volume-down' : volume <= 66 ? 'fas fa-volume' : 'fas fa-volume-up'} /> ${volume}</button>
      <input className='volume-slider' type='range' defaultValue=${volume} step='10' min='0' max='100' onInput=${event => { setVolume(event.target.value) }} onMouseUp=${(event => { send({ type: 'volume', volume: event.target.value }) })} />
    </div>
  `
}

function QueueButtons () {
  const input = React.createRef()
  const handlePlay = (event) => {
    event.preventDefault()
    send({ type: 'play', query: input.current.value })
    input.current.value = ''
  }
  return html`
    <div className='queue-button-container'>
      <form onSubmit=${handlePlay}>
        <input type='text' className='textfield' placeholder='Add to queue' ref=${input} />
        <button className='button'><i className='fas fa-plus' /> Play</button>
      </form>
      <button className='button' style=${{ marginRight: 0 }} onClick=${() => { send({ type: 'clear' }) }}><i className='fas fa-trash-alt' /> Clear queue</button>
    </div>
  `
}

function Queue (props) {
  const rows = []
  for (let i = 1; i < props.tracks.length; i++) {
    rows.push(html`
      <tr key=${i}>
        <td><span className='text-nowrap'>${i}</span></td>
        <td><span className='text-nowrap'>${props.tracks[i].title}</span></td>
        <td><span className='text-nowrap'>${props.tracks[i].author}</span></td>
        <td><span className='text-nowrap'>${props.tracks[i].live ? '🔴 Live' : props.tracks[i].duration}</span></td>
        <td><span className='text-nowrap'><button className='button square transparent' onClick=${() => { send({ type: 'remove', index: i }) }}><i className='fas fa-trash-alt' /></button><button className='button square transparent' onClick=${() => { send({ type: 'skipto', index: i }) }}><i className='fas fa-forward' /></button></span></td>
      </tr>
    `)
  }
  return html`
    <div>
      <h1 className='queue-title'>Queue</h1>
      <${QueueButtons} />
      <div className='table-responsive'>
        <table className='table table-dark table-striped'>
          <thead>
            <tr>
              <th>#</th>
              <th style=${{ width: '100%' }}>Track</th>
              <th>Author</th>
              <th>Duration</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    </div>
  `
}

function Toast (props) {
  if (!props.type || !props.message) { return null }

}

function MediaSession (props) {
  React.useEffect(async () => {
    if (navigator.userAgent.indexOf('Firefox') !== -1) {
      const audio = document.createElement('audio')
      audio.src = '/near-silence.mp3'
      audio.volume = 0.00001
      audio.load()
      await audio.play().catch(() => console.log('Autoplay seems to be disabled. Enable Media Autoplay to use media buttons to control the music bot!'))
      setTimeout(() => audio.pause(), 100)
    }
  }, [])
  React.useEffect(() => {
    function htmlDecode (input) { return (new DOMParser().parseFromString(input, 'text/html')).documentElement.textContent }

    navigator.mediaSession.metadata = new MediaMetadata({
      title: htmlDecode(props.track.title),
      artist: htmlDecode(props.track.author),
      album: htmlDecode(props.track.author),
      artwork: [{ src: htmlDecode(props.track.thumbnail) }]
    })
    navigator.mediaSession.playbackState = props.paused ? 'paused' : 'playing'

    navigator.mediaSession.setActionHandler('play', () => { send({ type: 'pause' }) })
    navigator.mediaSession.setActionHandler('pause', () => { send({ type: 'pause' }) })
    navigator.mediaSession.setActionHandler('nexttrack', () => { send({ type: 'skip' }) })
    navigator.mediaSession.setActionHandler('previoustrack', () => { send({ type: 'previous' }) })
  }, [props.track, props.paused])
  return null
}

const domContainer = document.querySelector('#react-container')
ReactDOM.render(html`<${App} />`, domContainer)
