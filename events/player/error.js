const { errorEmbed } = require('../../utilities')
module.exports = {
  name: 'error',
  execute (error, queue) {
    if (error === 'Status code: 403') { return queue.data.channel.send(errorEmbed('Error', `There was an error playing the song \`${queue.nowPlaying.name}\`.`)) }
    if (error === 'Status code: 410') { return queue.data.channel.send(errorEmbed('Error', 'Status code: 410\nIs the video possibly age restricted?\nAge restricted videos currently don\'t work!')) }
    queue.data.channel.send(errorEmbed('Error', error))
  }
}
