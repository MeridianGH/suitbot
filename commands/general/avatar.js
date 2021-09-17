const { SlashCommandBuilder } = require('@discordjs/builders')
const { simpleEmbed } = require('../../utilities')
const { MessageEmbed, GuildMember } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Gives information about a user\'s avatar.')
    .addMentionableOption(option =>
      option.setName('user')
        .setDescription('The user to get the avatar from.')
        .setRequired(true)),
  async execute (interaction) {
    const user = interaction.options.getMentionable('user')
    if (!(user instanceof GuildMember)) {
      return await interaction.reply(simpleEmbed('You can only specify a valid user!', true))
    }

    const avatar = `https://cdn.discordapp.com/avatars/${user.user.id}/${user.user.avatar}?size=1024`
    const embed = new MessageEmbed()
      .setAuthor('Avatar', `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}`)
      .setTitle(user.displayName)
      .setURL(avatar)
      .setImage(avatar)
      .setFooter('SuitBot', 'https://cdn.discordapp.com/app-icons/887122733010411611/78c68033a9da502750c5165029b57817.png')

    await interaction.reply({ embeds: [embed] })
  }
}
