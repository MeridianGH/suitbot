const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dashboard')
    .setDescription('Sends a link to the dashboard.'),
  async execute (interaction) {
    const embed = new MessageEmbed()
      .setAuthor({ name: 'Dashboard', iconURL: interaction.member.user.displayAvatarURL() })
      .setTitle('SuitBot Dashboard')
      .setURL('https://suitbot.xyz')
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .setDescription('The bots dashboard website.')
      .setFooter({ text: 'SuitBot', iconURL: interaction.client.user.displayAvatarURL() })
    await interaction.reply({ embeds: [embed] })
  }
}
