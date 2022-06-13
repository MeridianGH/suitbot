import { SlashCommandBuilder } from '@discordjs/builders'
import { GuildMember, MessageEmbed } from 'discord.js'
import { errorEmbed } from '../../utilities/utilities.js'
import { getLanguage } from '../../language/locale.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Shows info about a user.')
    .addMentionableOption((option) => option.setName('user').setDescription('The user to get info from.').setRequired(true)),
  async execute(interaction) {
    const lang = getLanguage(await interaction.client.database.getLocale(interaction.guildId)).userinfo
    const member = interaction.options.getMentionable('user')
    if (!(member instanceof GuildMember)) { return await interaction.reply(errorEmbed(lang.errors.invalidUser, true)) }

    const created = Math.floor(member.user.createdAt.getTime() / 1000)
    const joined = Math.floor(member.joinedAt.getTime() / 1000)
    const embed = new MessageEmbed()
      .setAuthor({ name: lang.author, iconURL: interaction.member.user.displayAvatarURL() })
      .setTitle(member.displayName)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 1024 }))
      .addField(lang.fields.fullName.name, member.user.tag, true)
      .addField(lang.fields.nickname.name, member.nickname ?? '-', true)
      .addField(lang.fields.bot.name, member.user.bot ? '✅' : '❌', true)
      .addField(lang.fields.id.name, member.id, true)
      .addField(lang.fields.profile.name, `<@${member.id}>`, true)
      .addField(lang.fields.avatarURL.name, `[${lang.fields.avatarURL.value}](${member.user.displayAvatarURL({ dynamic: true, size: 1024 })})`, true)
      .addField(lang.fields.created.name, `<t:${created}> (<t:${created}:R>)`)
      .addField(lang.fields.joined.name, `<t:${joined}> (<t:${joined}:R>)`)
      .setFooter({ text: 'SuitBot', iconURL: interaction.client.user.displayAvatarURL() })

    await interaction.reply({ embeds: [embed] })
  }
}
