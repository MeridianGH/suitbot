import { SlashCommandBuilder } from '@discordjs/builders'
import { simpleEmbed } from '../../utilities/utilities.js'
import { GuildMember, MessageEmbed, Permissions } from 'discord.js'
import { ChannelType } from 'discord-api-types/v9'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('move')
    .setDescription('Moves the mentioned user to the specified channel.')
    .addMentionableOption(option => option.setName('user').setDescription('The user to move.').setRequired(true))
    .addChannelOption(option => option.setName('channel').setDescription('The channel to move to.').addChannelType(ChannelType.GuildVoice).setRequired(true)),
  async execute (interaction) {
    const member = interaction.options.getMentionable('user')
    const channel = interaction.options.getChannel('channel')

    if (!interaction.member.permissions.has(Permissions.FLAGS.MOVE_MEMBERS)) { return await interaction.reply(simpleEmbed('You do not have permission to execute this command!', true)) }
    if (!(member instanceof GuildMember)) { return await interaction.reply(simpleEmbed('You can only specify a valid user!', true)) }
    if (!interaction.guild.me.permissions.has(Permissions.FLAGS.MOVE_MEMBERS)) { return await interaction.reply(simpleEmbed('The bot is missing permissions to move that user!', true)) }

    await member.voice.setChannel(channel)

    const embed = new MessageEmbed()
      .setAuthor({ name: 'Moved User', iconURL: interaction.member.user.displayAvatarURL() })
      .setTitle(`${member.displayName} → ${channel.name}`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 1024 }))
      .setDescription(`Moved \`${member.displayName}\` to \`${channel.name}\`.`)
      .setFooter({ text: 'SuitBot', iconURL: interaction.client.user.displayAvatarURL() })

    await interaction.reply({ embeds: [embed] })
  }
}
