const { simpleEmbed } = require('../../utilities')
module.exports = {
  name: 'queueEnd',
  execute (queue) {
    queue.lastTextChannel.send(simpleEmbed('Queue ended.\nLeft the voice channel.'))
  }
}
