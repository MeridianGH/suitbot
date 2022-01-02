const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, GuildMember } = require('discord.js')
const { simpleEmbed, timeSince } = require('../../utilities')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Shows info about a user.')
    .addMentionableOption(option => option.setName('user').setDescription('The user to get info from.').setRequired(true)),
  async execute (interaction) {
    const member = interaction.options.getMentionable('user')
    if (!(member instanceof GuildMember)) { return await interaction.reply(simpleEmbed('You can only specify a valid user!', true)) }

    let userStatus
    switch (member.presence.status) {
      case 'online':
        userStatus = '🟢 Online'
        break
      case 'idle':
        userStatus = '🟡 Idle'
        break
      case 'dnd':
        userStatus = '🔴 Do not Disturb'
        break
      case 'offline':
      case 'invisible': // I have no idea if I really need this, but it's error proof.
        userStatus = '⚫ Offline'
        break
    }

    const embed = new MessageEmbed()
      .setAuthor('User Information', interaction.member.user.displayAvatarURL())
      .setTitle(member.displayName)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 1024 }))
      .addField('Full Name', member.user.tag, true)
      .addField('Nickname', member.nickname ?? 'None', true)
      .addField('Bot', member.user.bot ? '✅' : '❌', true)
      .addField('ID', member.id, true)
      .addField('Profile', `<@${member.id}>`, true)
      .addField('Avatar URL', `[Avatar URL](${member.user.displayAvatarURL({ dynamic: true, size: 1024 })})`, true)
      .addField('Status', userStatus)
      .addField('Created', `${member.user.createdAt.toUTCString()} (${timeSince(member.user.createdAt)})`)
      .addField('Joined', `${member.joinedAt.toUTCString()} (${timeSince(member.joinedAt)})`)
      .setFooter('SuitBot', interaction.client.user.displayAvatarURL())

    await interaction.reply({ embeds: [embed] })
  }
}
