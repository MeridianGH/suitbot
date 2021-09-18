const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('github')
    .setDescription('Sends a link to the repo of this bot.'),
  async execute (interaction) {
    const embed = new MessageEmbed()
      .setAuthor('GitHub', interaction.member.user.displayAvatarURL())
      .setTitle('GitHub Repository')
      .setURL('https://github.com/MeridianGH/suitbot')
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .setDescription('The source code for this bot along with helpful information.')
      .setFooter('SuitBot', interaction.client.user.displayAvatarURL())
    await interaction.reply({ embeds: [embed] })
  }
}
