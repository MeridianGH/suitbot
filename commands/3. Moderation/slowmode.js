import { SlashCommandBuilder } from '@discordjs/builders'
import { MessageEmbed, Permissions } from 'discord.js'
import { simpleEmbed } from '../../utilities/utilities.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Sets the rate limit of the current channel.')
    .addIntegerOption((option) => option.setName('seconds').setDescription('The new rate limit in seconds.').setRequired(true)),
  async execute(interaction) {
    const seconds = interaction.options.getInteger('seconds')

    if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) { return await interaction.reply(simpleEmbed('You do not have permission to execute this command!', true)) }
    if (!interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) { return await interaction.reply(simpleEmbed('The bot is missing permissions to manage channels!', true)) }

    await interaction.channel.setRateLimitPerUser(seconds)

    const embed = new MessageEmbed()
      .setAuthor({ name: 'Set Slowmode', iconURL: interaction.member.user.displayAvatarURL() })
      .setTitle(`#${interaction.channel.name}`)
      .setThumbnail(interaction.guild.iconURL())
      .setDescription(`Set the rate limit of #${interaction.channel.name} to ${seconds}s.`)
      .setFooter({ text: 'SuitBot', iconURL: interaction.client.user.displayAvatarURL() })

    await interaction.reply({ embeds: [embed] })
  }
}
