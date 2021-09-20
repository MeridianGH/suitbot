const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Shows info about the bot.'),
  async execute (interaction) {
    const client = interaction.client
    const servers = `**Servers:** ${client.guilds.cache.size}\n`

    let totalSeconds = (client.uptime / 1000)
    const days = Math.floor(totalSeconds / 86400)
    totalSeconds %= 86400
    const hours = Math.floor(totalSeconds / 3600)
    totalSeconds %= 3600
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = Math.floor(totalSeconds % 60)
    const uptime = `**Uptime:** ${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds.`

    const embed = new MessageEmbed()
      .setAuthor('Info', interaction.member.user.displayAvatarURL())
      .setTitle('Bot Information')
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .setDescription(servers + uptime)
      .setFooter('SuitBot', interaction.client.user.displayAvatarURL())

    await interaction.reply({ embeds: [embed] })
  }
}
