const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Sends an invite link for the bot.'),
  async execute (interaction) {
    const embed = new MessageEmbed()
      .setAuthor({ name: 'Invite', iconURL: interaction.member.user.displayAvatarURL() })
      .setTitle('Invite SuitBot')
      .setURL('https://discord.com/oauth2/authorize?client_id=887122733010411611&scope=bot%20applications.commands&permissions=2167425024')
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .setDescription('Click this link to invite SuitBot to your server!')
      .setFooter({ text: 'SuitBot', iconURL: interaction.client.user.displayAvatarURL() })
    await interaction.reply({ embeds: [embed] })
  }
}
