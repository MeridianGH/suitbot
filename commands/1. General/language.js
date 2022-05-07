import { SlashCommandBuilder } from '@discordjs/builders'
import { MessageEmbed } from 'discord.js'
import { getLanguage } from '../../language/locale.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('language')
    .setDescription('Changes the bots language.')
    .addStringOption((option) => option.setName('language').setDescription('The language to select.').setRequired(true).addChoices([
      ['English', 'en-US'],
      ['Deutsch', 'de-DE'],
      ['Suomi', 'fi-FI'],
      ['Português do Brasil', 'pt-BR']
    ])),
  async execute(interaction) {
    // TODO: Check for permissions
    const langCode = interaction.options.getString('language')
    const lang = getLanguage(langCode).language
    await interaction.client.database.setLocale(interaction.guild.id, langCode)
    const embed = new MessageEmbed()
      .setAuthor({ name: lang.author, iconURL: interaction.member.user.displayAvatarURL() })
      .setTitle(lang.title)
      .setDescription(lang.description(langCode))
      .setFooter({ text: 'SuitBot', iconURL: interaction.client.user.displayAvatarURL() })

    await interaction.reply({ embeds: [embed] })
  }
}
