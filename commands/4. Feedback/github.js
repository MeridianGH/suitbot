const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('github')
    .setDescription('Sends a link to the source code of this bot.'),
  async execute (interaction) {
    const embed = new MessageEmbed()
      .setAuthor({ name: 'GitHub', iconURL: interaction.member.user.displayAvatarURL() })
      .setTitle('GitHub Repository')
      .setURL('https://github.com/MeridianGH/suitbot')
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .setDescription('The source code for this bot along with helpful information.')
      .setFooter({ text: 'SuitBot', iconURL: interaction.client.user.displayAvatarURL() })
    await interaction.reply({ embeds: [embed] })
  }
}
