const { simpleEmbed } = require('../../utilities')
module.exports = {
  name: 'channelEmpty',
  execute (queue) {
    queue.metadata.channel.send(simpleEmbed('Left the voice channel because it was empty.'))
    queue.destroy()
  }
}