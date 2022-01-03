module.exports = {
  name: 'queueEnd',
  execute (queue) {
    setTimeout(() => {
      if (!queue.isPlaying) { queue.stop() } else { console.log('cancelled') }
    }, 30000)
  }
}
