const { simpleEmbed } = require('../../utilities')
module.exports = {
  name: 'channelEmpty',
  execute (queue) {
    queue.lastTextChannel.send(simpleEmbed('Left the voice channel because it was empty.'))
  }
}
