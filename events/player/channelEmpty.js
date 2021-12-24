const { simpleEmbed, sleep } = require('../../utilities')
module.exports = {
  name: 'channelEmpty',
  async execute (queue) {
    await sleep(30)
    queue.data.channel.send(simpleEmbed('Left the voice channel because it was empty.'))
  }
}
