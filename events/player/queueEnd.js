module.exports = {
  name: 'queueEnd',
  execute (queue) {
    setTimeout(() => {
      if (!queue.isPlaying) { queue.stop() }
    }, 30000)
  }
}
