const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, GuildMember } = require('discord.js')
const { simpleEmbed } = require('../../utilities')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Shows info about a user.')
    .addMentionableOption(option => option.setName('user').setDescription('The user to get info from.').setRequired(true)),
  async execute (interaction) {
    const member = interaction.options.getMentionable('user')
    if (!(member instanceof GuildMember)) {
      return await interaction.reply(simpleEmbed('You can only specify a valid user!', true))
    }
    const description =
`**Created:** ${member.user.createdAt.toUTCString()}
**Joined:** ${member.joinedAt.toUTCString()}
**Full Name:** ${member.user.tag}
**Status:** ${member.presence.status === 'dnd' ? 'Do not disturb' : member.presence.status[0].toUpperCase() + member.presence.status.substring(1)}
**Avatar:** [Link](${member.user.displayAvatarURL({ format: 'png', size: 1024 })})
**Bot:** ${member.user.bot ? 'Yes' : 'No'}`

    const embed = new MessageEmbed()
      .setAuthor('User Information', interaction.member.user.displayAvatarURL())
      .setTitle(member.displayName)
      .setThumbnail(member.user.displayAvatarURL({ format: 'png', size: 1024 }))
      .setDescription(description)
      .setFooter('SuitBot', interaction.client.user.displayAvatarURL())

    await interaction.reply({ embeds: [embed] })
  }
}
