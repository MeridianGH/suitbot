const { simpleEmbed } = require('../../utilities')
module.exports = {
  name: 'channelEmpty',
  execute (queue) {
    queue.data.channel.send(simpleEmbed('Left the voice channel because it was empty.'))
  }
}
