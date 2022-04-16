import { SlashCommandBuilder } from '@discordjs/builders'
import { GuildMember, MessageEmbed } from 'discord.js'
import { simpleEmbed, timeSince } from '../../utilities/utilities.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Shows info about a user.')
    .addMentionableOption(option => option.setName('user').setDescription('The user to get info from.').setRequired(true)),
  async execute (interaction) {
    const member = interaction.options.getMentionable('user')
    if (!(member instanceof GuildMember)) { return await interaction.reply(simpleEmbed('You can only specify a valid user!', true)) }

    let userStatus
    const status = member.presence?.status ?? 'offline'
    switch (status) {
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
        userStatus = '⚫ Offline'
        break
    }

    const embed = new MessageEmbed()
      .setAuthor({ name: 'User Information', iconURL: interaction.member.user.displayAvatarURL() })
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
      .setFooter({ text: 'SuitBot', iconURL: interaction.client.user.displayAvatarURL() })

    await interaction.reply({ embeds: [embed] })
  }
}
