const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Shows info about the bot.'),
  async execute (interaction) {
    let totalSeconds = (interaction.client.uptime / 1000)
    const days = Math.floor(totalSeconds / 86400)
    totalSeconds %= 86400
    const hours = Math.floor(totalSeconds / 3600)
    totalSeconds %= 3600
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = Math.floor(totalSeconds % 60)
    const uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds.`

    const embed = new MessageEmbed()
      .setAuthor('Info', interaction.member.user.displayAvatarURL())
      .setTitle('Bot Information')
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .addField('Servers', interaction.client.guilds.cache.size.toString(), true)
      .addField('Uptime', uptime, true)
      .addField('Memory Usage', `heapUsed: ${process.memoryUsage().heapUsed / 1024 / 1024 * 100}MB | heapTotal: ${process.memoryUsage().heapTotal / 1024 / 1024 * 100}MB`)
      .setFooter('SuitBot', interaction.client.user.displayAvatarURL())

    await interaction.reply({ embeds: [embed] })
  }
}
