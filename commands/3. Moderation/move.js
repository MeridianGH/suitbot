import { SlashCommandBuilder } from '@discordjs/builders'
import { errorEmbed } from '../../utilities/utilities.js'
import { GuildMember, MessageEmbed, Permissions } from 'discord.js'
import { ChannelType } from 'discord-api-types/v9'
import locale from '../../language/locale.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('move')
    .setDescription('Moves the mentioned user to the specified channel.')
    .addMentionableOption((option) => option.setName('user').setDescription('The user to move.').setRequired(true))
    .addChannelOption((option) => option.setName('channel').setDescription('The channel to move to.').addChannelType(ChannelType.GuildVoice).setRequired(true)),
  async execute(interaction) {
    const { move: lang } = locale[await interaction.client.database.getLocale(interaction.guildId)]
    const member = interaction.options.getMentionable('user')
    const channel = interaction.options.getChannel('channel')

    if (!interaction.member.permissions.has(Permissions.FLAGS.MOVE_MEMBERS)) { return await interaction.reply(errorEmbed(lang.errors.userMissingPerms, true)) }
    if (!(member instanceof GuildMember)) { return await interaction.reply(errorEmbed(lang.errors.invalidUser, true)) }
    if (!interaction.guild.me.permissions.has(Permissions.FLAGS.MOVE_MEMBERS)) { return await interaction.reply(errorEmbed(lang.errors.missingPerms, true)) }

    await member.voice.setChannel(channel)

    const embed = new MessageEmbed()
      .setAuthor({ name: lang.author, iconURL: interaction.member.user.displayAvatarURL() })
      .setTitle(`${member.displayName} → ${channel.name}`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 1024 }))
      .setDescription(lang.description(member.displayName, channel.name))
      .setFooter({ text: 'SuitBot', iconURL: interaction.client.user.displayAvatarURL() })

    await interaction.reply({ embeds: [embed] })
  }
}
