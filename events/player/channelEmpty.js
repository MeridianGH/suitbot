const { simpleEmbed, sleep } = require('../../utilities')
module.exports = {
  name: 'channelEmpty',
  async execute (queue) {
    await sleep(30)
    queue.lastTextChannel.send(simpleEmbed('Left the voice channel because it was empty.'))
  }
}
