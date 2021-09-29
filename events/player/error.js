const { MessageEmbed } = require('discord.js')
module.exports = {
  name: 'error',
  execute (error, queue) {
    queue.lastTextChannel?.send({ embeds: [new MessageEmbed().setTitle('Error').setDescription(error).setFooter('SuitBot', require('../client/ready').iconURL).setColor('#ff0000')] })
  }
}
