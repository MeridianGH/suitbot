import { SlashCommandBuilder } from '@discordjs/builders'
import { MessageEmbed } from 'discord.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('dashboard')
    .setDescription('Sends a link to the dashboard.'),
  async execute (interaction) {
    const embed = new MessageEmbed()
      .setAuthor({ name: 'Dashboard', iconURL: interaction.member.user.displayAvatarURL() })
      .setTitle('SuitBot Dashboard')
      .setURL('https://suitbot.xyz')
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .setDescription('The bots dashboard website.')
      .setFooter({ text: 'SuitBot', iconURL: interaction.client.user.displayAvatarURL() })
    await interaction.reply({ embeds: [embed] })
  }
}
