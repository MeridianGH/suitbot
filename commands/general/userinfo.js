import { EmbedBuilder, GuildMember, SlashCommandBuilder } from 'discord.js'
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
    const embed = new EmbedBuilder()
      .setAuthor({ name: lang.author, iconURL: interaction.member.user.displayAvatarURL() })
      .setTitle(member.displayName)
      .setThumbnail(member.user.displayAvatarURL({ size: 1024 }))
      .addFields([
        { name: lang.fields.fullName.name, value: member.user.tag, inline: true },
        { name: lang.fields.nickname.name, value: member.nickname ?? '-', inline: true },
        { name: lang.fields.bot.name, value: member.user.bot ? '✅' : '❌', inline: true },
        { name: lang.fields.id.name, value: member.id, inline: true },
        { name: lang.fields.profile.name, value: `<@${member.id}>`, inline: true },
        { name: lang.fields.avatarURL.name, value: `[${lang.fields.avatarURL.value}](${member.user.displayAvatarURL({ size: 1024 })})`, inline: true },
        { name: lang.fields.created.name, value: `<t:${created}> (<t:${created}:R>)` },
        { name: lang.fields.joined.name, value: `<t:${joined}> (<t:${joined}:R>)` }
      ])
      .setFooter({ text: 'SuitBot', iconURL: interaction.client.user.displayAvatarURL() })

    await interaction.reply({ embeds: [embed] })
  }
}
