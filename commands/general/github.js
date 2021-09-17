const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('github')
    .setDescription('Sends a link to the repo of this bot.'),
  async execute (interaction) {
    const embed = new MessageEmbed()
      .setAuthor('GitHub', `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}`)
      .setTitle('GitHub Repository')
      .setURL('https://github.com/MeridianGH/suitbot')
      .setThumbnail('https://cdn.discordapp.com/app-icons/887122733010411611/78c68033a9da502750c5165029b57817.png')
      .setDescription('The source code for this bot along with helpful information.')
      .setFooter('SuitBot', 'https://cdn.discordapp.com/app-icons/887122733010411611/78c68033a9da502750c5165029b57817.png')
    await interaction.reply({embeds: [embed]})
  }
}
