const { errorEmbed } = require('../../utilities')
module.exports = {
  name: 'error',
  execute (error, queue) {
    queue.lastTextChannel?.send(errorEmbed('Error', error))
  }
}
