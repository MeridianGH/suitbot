const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, GuildMember } = require('discord.js')
const { simpleEmbed } = require('../../utilities')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Shows info about a user.')
    .addMentionableOption(option =>
      option.setName('user')
        .setDescription('The user to get info from.')
        .setRequired(true)),
  async execute (interaction) {
    const user = interaction.options.getMentionable('user')
    if (!(user instanceof GuildMember)) {
      return await interaction.reply(simpleEmbed('You can only specify a valid user!', true))
    }
    const description = `**Created:** ${user.user.createdAt.toUTCString()}\n**Joined:** ${user.joinedAt.toUTCString()}\n**Full Name:** ${user.user.username}#${user.user.discriminator}\n`

    const embed = new MessageEmbed()
      .setAuthor('User Information', `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}`)
      .setTitle(user.displayName)
      .setThumbnail(`https://cdn.discordapp.com/avatars/${user.user.id}/${user.user.avatar}`)
      .setDescription(description)
      .setFooter('SuitBot', interaction.client.application.iconURL())

    await interaction.reply({ embeds: [embed] })
  }
}
