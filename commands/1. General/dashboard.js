const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dashboard')
    .setDescription('Sends a link to the dashboard.'),
  async execute (interaction) {
    const embed = new MessageEmbed()
      .setAuthor('Dashboard', interaction.member.user.displayAvatarURL())
      .setTitle('SuitBot Dashboard')
      .setURL('http://suitbot.xyz')
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .setDescription('The bots dashboard website.')
      .setFooter('SuitBot', interaction.client.user.displayAvatarURL())
    await interaction.reply({ embeds: [embed] })
  }
}
