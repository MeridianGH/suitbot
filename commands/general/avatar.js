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
      .setAuthor('Avatar', interaction.member.user.displayAvatarURL())
      .setTitle(user.displayName)
      .setURL(avatar)
      .setImage(avatar)
      .setFooter('SuitBot', interaction.client.user.displayAvatarURL())

    await interaction.reply({ embeds: [embed] })
  }
}
