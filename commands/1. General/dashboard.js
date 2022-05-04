import { SlashCommandBuilder } from '@discordjs/builders'
import { MessageEmbed } from 'discord.js'
import locale from '../../language/locale.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('dashboard')
    .setDescription('Sends a link to the dashboard.'),
  async execute(interaction) {
    const { dashboard: lang } = locale[await interaction.client.database.getLocale(interaction.guildId)]
    const embed = new MessageEmbed()
      .setAuthor({ name: lang.author, iconURL: interaction.member.user.displayAvatarURL() })
      .setTitle(lang.title)
      .setURL('https://suitbot.xyz')
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .setDescription(lang.description)
      .setFooter({ text: 'SuitBot', iconURL: interaction.client.user.displayAvatarURL() })
    await interaction.reply({ embeds: [embed] })
  }
}
