module.exports = {
  name: 'queueEnd',
  execute (queue) {
    setTimeout(() => {
      if (!queue.playing && !queue.destroyed) { queue.destroy() }
    }, 30000)
  }
}