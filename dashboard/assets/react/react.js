// import React from 'react'
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
      console.log('Websocket connected, requesting queue data...')
      send({ type: 'request' })
    })
    websocket.addEventListener('message', message => {
      console.log('Received queue data:')
      loader.remove()
      this.setState(JSON.parse(message.data))
      console.log(this.state)
    })

    this.interval = setInterval(() => {
      if (!this.state.empty && !this.state.paused) {
        this.setState((state) => {
          if (state.streamTime >= state.current.durationMS) {
            clearInterval(this.interval)
            return { streamTime: state.streamTime = state.current.durationMS }
          }
          return { streamTime: state.streamTime += 1000 }
        })
      }
    }, 1000)
  }
  componentWillUnmount () {
    clearInterval(this.interval)
  }
  render () {
    if (!this.state) { return null }
    if (this.state.empty) { return <div>Nothing currently playing!<br/>Join a voice channel and type "/play" to get started!</div> }
    return (
      <div>
        <h1 className='queue-title'>Now Playing</h1>
        <NowPlaying track={this.state.current} paused={this.state.paused} streamTime={this.state.streamTime} repeatMode={this.state.repeatMode}/>
        <VolumeControl volume={this.state.volume}/>
        <div style={{ marginBottom: 20 }}/>
        <h1 className='queue-title'>Queue</h1>
        <Queue tracks={this.state.tracks}/>
      </div>
    )
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
  return (
    <div className='nowplaying-container'>
      <ul className='horizontal-list'>
        <li>
          <Thumbnail image={props.track.thumbnail}/>
          <div className='progress-container'>
            <div className='progress' style={{ width: props.track.durationMS === 0 ? '100%' : props.streamTime / props.track.durationMS * 100 + '%' }}/>
          </div>
        </li>
        <li>
          <a href={props.track.url} target='_blank'><h4>{props.track.title}</h4></a>
          <h6>{props.track.author}</h6>
          <h5>{props.track.durationMS === 0 ? '🔴 Live' : `${msToHMS(props.streamTime)} / ${props.track.duration}`}</h5>
          <MusicControls paused={props.paused} repeatMode={props.repeatMode}/>
        </li>
      </ul>
    </div>
  )
}

function Thumbnail (props) {
  return (
    <div className='thumbnail-container'>
      <img className='thumbnail-backdrop' src={props.image}/>
      <img className='thumbnail' src={props.image}/>
    </div>
  )
}

function MusicControls (props) {
  const onClick = (action) => {
    send({ type: action })
  }
  return (
    <div>
      <button className='button square' onClick={onClick.bind(this, 'previous')}><i className='fas fa-backward'/></button>
      <button className='button square' onClick={onClick.bind(this, 'pause')}><i className={props.paused ? 'fas fa-play' : 'fas fa-pause'}/></button>
      <button className='button square' onClick={onClick.bind(this, 'skip')}><i className='fas fa-forward'/></button>
      &nbsp;&nbsp;
      <button className='button square' onClick={onClick.bind(this, 'shuffle')}><i className='fas fa-random'/></button>
      <button className='button square' onClick={onClick.bind(this, 'repeat')}><i className={props.repeatMode === 0 ? 'fad fa-repeat-alt' : props.repeatMode === 1 ? 'fas fa-repeat-1-alt' : 'fas fa-repeat'}/></button>
    </div>
  )
}

class VolumeControl extends React.Component {
  constructor (props) {
    super(props)
    this.state = { volume: props.volume }
  }
  changeVolume = (event) => {
    this.setState({ volume: event.target.value })
  }
  setVolume = (event) => {
    send({ type: 'volume', volume: event.target.value })
  }
  render () {
    return (
      <div>
        <button className='volume-display' disabled={true}><i className={`fas fa-volume${this.state.volume === 0 ? '-off' : this.state.volume <= 33 ? '-down' : this.state.volume <= 66 ? '' : '-up'}`}/> {this.state.volume}</button>
        <input className='volume-slider' type="range" defaultValue={this.state.volume} step="10" min="0" max="100" onInput={this.changeVolume} onMouseUp={this.setVolume}/>
      </div>
    )
  }
}

function QueueButtons () {
  const input = React.createRef()
  const handlePlay = (event) => {
    event.preventDefault()
    send({ type: 'play', query: input.current.value })
    input.current.value = ''
  }
  const handleClear = () => {
    send({ type: 'clear' })
  }
  return (
    <div className="queue-button-container">
      <form onSubmit={handlePlay}>
        <input type="text" className="textfield" placeholder="Add to queue" ref={input}/>
        <button className="button"><i className="fas fa-plus"/> Play</button>
      </form>
      <button className="button" onClick={handleClear}><i className="fas fa-trash-alt"/> Clear queue</button>
    </div>
  )
}

function Queue (props) {
  const onClick = (action, index) => {
    send({ type: action, index: index })
  }
  const rows = []
  for (let i = 0; i < props.tracks.length; i++) {
    rows.push(
      <tr key={i}>
        <td><span className="text-nowrap">{i + 1}</span></td>
        <td><span className="text-nowrap">{props.tracks[i].title}</span></td>
        <td><span className="text-nowrap">{props.tracks[i].author}</span></td>
        <td><span className="text-nowrap">{props.tracks[i].durationMS === 0 ? '🔴 Live' : props.tracks[i].duration}</span></td>
        <td><span className="text-nowrap"><button className="button square transparent" onClick={onClick.bind(this, 'remove', i)}><i className="fas fa-trash-alt"/></button><button className="button square transparent" onClick={onClick.bind(this, 'skipto', i)}><i className="fas fa-forward"/></button></span></td>
      </tr>
    )
  }
  return (
    <div>
      <QueueButtons/>
      <div className="table-responsive">
        <table className="table table-dark table-striped">
          <thead>
          <tr>
            <th>#</th>
            <th style={{ width: '100%' }}>Track</th>
            <th>Author</th>
            <th>Duration</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          {rows}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const domContainer = document.querySelector('#react-container')
ReactDOM.render(<App/>, domContainer)