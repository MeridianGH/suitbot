import { SlashCommandBuilder } from '@discordjs/builders'
import { MessageEmbed } from 'discord.js'
import { timeSince } from '../../utilities/utilities.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Shows info about the server.'),
  async execute(interaction) {
    const guild = interaction.guild

    const embed = new MessageEmbed()
      .setAuthor({ name: 'Server Information', iconURL: interaction.member.user.displayAvatarURL() })
      .setTitle(guild.name)
      .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }))
      .addField('Members', guild.memberCount.toString(), true)
      .addField('Channels', guild.channels.channelCountWithoutThreads.toString(), true)
      .addField('Boosts', guild.premiumSubscriptionCount.toString() ?? '0', true)
      .addField('Owner', `<@${guild.ownerId}>`, true)
      .addField('Guild ID', guild.id, true)
      .addField('\u200b', '\u200b', true)
      .addField('Created', `${guild.createdAt.toUTCString()} (${timeSince(guild.createdAt)})`)
      .setFooter({ text: 'SuitBot', iconURL: interaction.client.user.displayAvatarURL() })

    await interaction.reply({ embeds: [embed] })
  }
}
