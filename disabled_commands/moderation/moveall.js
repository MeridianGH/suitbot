import { EmbedBuilder, PermissionsBitField, SlashCommandBuilder } from 'discord.js'
import { errorEmbed } from '../../utilities/utilities.js'
import { ChannelType } from 'discord-api-types/v10'
import { getLanguage } from '../../language/locale.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('moveall')
    .setDescription('Moves all users from the first channel to the second channel.')
    .addChannelOption((option) => option.setName('channel1').setDescription('The channel to move from.').addChannelTypes(ChannelType.GuildVoice).setRequired(true))
    .addChannelOption((option) => option.setName('channel2').setDescription('The channel to move to.').addChannelTypes(ChannelType.GuildVoice).setRequired(true)),
  async execute(interaction) {
    const lang = getLanguage(await interaction.client.database.getLocale(interaction.guildId)).moveall
    const channel1 = interaction.options.getChannel('channel1')
    const channel2 = interaction.options.getChannel('channel2')

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.MoveMembers)) { return await interaction.reply(errorEmbed(lang.errors.userMissingPerms, true)) }
    if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.MoveMembers)) { return await interaction.reply(errorEmbed(lang.errors.missingPerms, true)) }

    for (const user of channel1.members) {
      await user[1].voice.setChannel(channel2)
    }

    const embed = new EmbedBuilder()
      .setAuthor({ name: lang.author, iconURL: interaction.member.user.displayAvatarURL() })
      .setTitle(`${channel1.name} → ${channel2.name}`)
      .setThumbnail(interaction.guild.iconURL())
      .setDescription(lang.description(channel1.name, channel2.name))
      .setFooter({ text: 'SuitBot', iconURL: interaction.client.user.displayAvatarURL() })

    await interaction.reply({ embeds: [embed] })
  }
}
