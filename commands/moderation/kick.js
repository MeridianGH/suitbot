import { EmbedBuilder, GuildMember, PermissionsBitField, SlashCommandBuilder } from 'discord.js'
import { errorEmbed } from '../../utilities/utilities.js'
import { getLanguage } from '../../language/locale.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kicks a user.')
    .addMentionableOption((option) => option.setName('user').setDescription('The user to kick.').setRequired(true))
    .addStringOption((option) => option.setName('reason').setDescription('The reason for the kick.')),
  async execute(interaction) {
    const lang = getLanguage(await interaction.client.database.getLocale(interaction.guildId)).kick
    const member = interaction.options.getMentionable('user')
    const reason = interaction.options.getString('reason')

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) { return await interaction.reply(errorEmbed(lang.errors.userMissingPerms, true)) }
    if (!(member instanceof GuildMember)) { return await interaction.reply(errorEmbed(lang.errors.invalidUser, true)) }
    if (!member.kickable) { return await interaction.reply(errorEmbed(lang.errors.missingPerms, true)) }

    await member.kick(reason).catch(async () => await interaction.reply(errorEmbed(lang.errors.generic, true)))

    const embed = new EmbedBuilder()
      .setAuthor({ name: lang.author, iconURL: interaction.member.user.displayAvatarURL() })
      .setTitle(member.displayName)
      .setThumbnail(member.user.displayAvatarURL({ size: 1024 }))
      .setDescription(lang.description(reason))
      .setFooter({ text: 'SuitBot', iconURL: interaction.client.user.displayAvatarURL() })

    await interaction.reply({ embeds: [embed] })
  }
}
