const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Shows info about the server.'),
  async execute (interaction) {
    const guild = interaction.guild
    const description = `**Created:** ${guild.createdAt.toUTCString()}\n**Channels:** ${guild.channels.channelCountWithoutThreads}\n**Members:** ${guild.memberCount}\n`

    const embed = new MessageEmbed()
      .setAuthor('Server Information', `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}`)
      .setTitle(guild.name)
      .setThumbnail(guild.iconURL())
      .setDescription(description)
      .setFooter('SuitBot', interaction.client.application.iconURL())

    await interaction.reply({ embeds: [embed] })
  }
}
