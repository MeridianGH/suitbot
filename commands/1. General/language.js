import { SlashCommandBuilder } from '@discordjs/builders'
import { MessageEmbed } from 'discord.js'

// https://discord.com/developers/docs/reference#locales

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('language')
    .setDescription('Changes the bots language.')
    .addStringOption((option) => option.setName('language').setDescription('The language to select.').setRequired(true).addChoices([
      ['English', 'en-US'],
      ['Deutsch', 'de-DE'],
      ['Português do Brasil', 'pt-BR']
    ])),
  async execute(interaction) {
    const langCode = interaction.options.getString('language')
    await interaction.client.database.setLocale(interaction.guild.id, langCode)
    const embed = new MessageEmbed()
      .setAuthor({ name: 'Language', iconURL: interaction.member.user.displayAvatarURL() })
      .setTitle('Change language')
      .setDescription(`Set language to \`${langCode}\``)
      .setFooter({ text: 'SuitBot', iconURL: interaction.client.user.displayAvatarURL() })

    await interaction.reply({ embeds: [embed] })
  }
}
