const { errorEmbed } = require('../../utilities')
module.exports = {
  name: 'error',
  execute (queue, error) {
    switch (error.message) {
      case 'aborted':
      case 'Status code: 403':
        queue.metadata.channel.send(errorEmbed('Error', `There was an error playing the song \`${queue.current.title}\`.`))
        break
      case 'Status code: 410':
        queue.metadata.channel.send(errorEmbed('Error', 'Status code: 410\nIs the video possibly age restricted?\nAge restricted videos currently don\'t work!'))
        break
      default:
        queue.metadata.channel.send(errorEmbed('Error', error.message))
        break
    }
    if (!queue.playing && !queue.destroyed) { queue.destroy() }
  }
}
