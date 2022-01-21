module.exports = {
  name: 'songChanged',
  execute (queue, newSong, oldSong) {
    queue.setData({ channel: queue.data.channel, previous: oldSong })
  }
}
