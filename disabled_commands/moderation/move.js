import { EmbedBuilder, GuildMember, PermissionsBitField, SlashCommandBuilder } from 'discord.js'
import { errorEmbed } from '../../utilities/utilities.js'
import { ChannelType } from 'discord-api-types/v10'
import { getLanguage } from '../../language/locale.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('move')
    .setDescription('Moves the mentioned user to the specified channel.')
    .addMentionableOption((option) => option.setName('user').setDescription('The user to move.').setRequired(true))
    .addChannelOption((option) => option.setName('channel').setDescription('The channel to move to.').addChannelTypes(ChannelType.GuildVoice).setRequired(true)),
  async execute(interaction) {
    const lang = getLanguage(await interaction.client.database.getLocale(interaction.guildId)).move
    const member = interaction.options.getMentionable('user')
    const channel = interaction.options.getChannel('channel')

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.MoveMembers)) { return await interaction.reply(errorEmbed(lang.errors.userMissingPerms, true)) }
    if (!(member instanceof GuildMember)) { return await interaction.reply(errorEmbed(lang.errors.invalidUser, true)) }
    if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.MoveMembers)) { return await interaction.reply(errorEmbed(lang.errors.missingPerms, true)) }

    await member.voice.setChannel(channel)

    const embed = new EmbedBuilder()
      .setAuthor({ name: lang.author, iconURL: interaction.member.user.displayAvatarURL() })
      .setTitle(`${member.displayName} → ${channel.name}`)
      .setThumbnail(member.user.displayAvatarURL({ size: 1024 }))
      .setDescription(lang.description(member.displayName, channel.name))
      .setFooter({ text: 'SuitBot', iconURL: interaction.client.user.displayAvatarURL() })

    await interaction.reply({ embeds: [embed] })
  }
}
