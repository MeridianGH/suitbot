import { SlashCommandBuilder } from '@discordjs/builders'
import { GuildMember, MessageEmbed } from 'discord.js'
import { simpleEmbed, timeSince } from '../../utilities/utilities.js'
import locale from '../../language/locale.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Shows info about a user.')
    .addMentionableOption((option) => option.setName('user').setDescription('The user to get info from.').setRequired(true)),
  async execute(interaction) {
    const { userinfo: lang } = locale[await interaction.client.database.getLocale(interaction.guildId)]
    const member = interaction.options.getMentionable('user')
    if (!(member instanceof GuildMember)) { return await interaction.reply(simpleEmbed(lang.errors.invalidUser, true)) }

    let userStatus
    const status = member.presence?.status ?? 'offline'
    switch (status) {
      case 'online':
        userStatus = '🟢 ' + lang.other.online
        break
      case 'idle':
        userStatus = '🟡 ' + lang.other.idle
        break
      case 'dnd':
        userStatus = '🔴 ' + lang.other.dnd
        break
      case 'offline':
        userStatus = '⚫ ' + lang.other.offline
        break
    }

    const embed = new MessageEmbed()
      .setAuthor({ name: lang.author, iconURL: interaction.member.user.displayAvatarURL() })
      .setTitle(member.displayName)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 1024 }))
      .addField(lang.fields.fullName.name, member.user.tag, true)
      .addField(lang.fields.nickname.name, member.nickname ?? 'None', true)
      .addField(lang.fields.bot.name, member.user.bot ? '✅' : '❌', true)
      .addField(lang.fields.id.name, member.id, true)
      .addField(lang.fields.profile.name, `<@${member.id}>`, true)
      .addField(lang.fields.avatarURL.name, `[${lang.fields.avatarURL.value}](${member.user.displayAvatarURL({ dynamic: true, size: 1024 })})`, true)
      .addField(lang.fields.status.name, userStatus)
      .addField(lang.fields.created.name, `${member.user.createdAt.toUTCString()} (${timeSince(member.user.createdAt)})`)
      .addField(lang.fields.joined.name, `${member.joinedAt.toUTCString()} (${timeSince(member.joinedAt)})`)
      .setFooter({ text: 'SuitBot', iconURL: interaction.client.user.displayAvatarURL() })

    await interaction.reply({ embeds: [embed] })
  }
}
