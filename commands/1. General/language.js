import { SlashCommandBuilder } from '@discordjs/builders'
import { MessageEmbed, Permissions } from 'discord.js'
import { getLanguage } from '../../language/locale.js'
import { errorEmbed } from '../../utilities/utilities.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('language')
    .setDescription('Changes the bots language.')
    .addStringOption((option) => option.setName('language').setDescription('The language to select.').setRequired(true).addChoices([
      ['English', 'en-US'],
      ['Deutsch', 'de'],
      ['Suomi', 'fi'],
      ['Português do Brasil', 'pt-BR']
    ])),
  async execute(interaction) {
    const langCode = interaction.options.getString('language')
    const lang = getLanguage(langCode).language
    if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) { return await interaction.reply(errorEmbed(lang.errors.userMissingPerms, true)) }

    await interaction.client.database.setLocale(interaction.guild.id, langCode)
    const embed = new MessageEmbed()
      .setAuthor({ name: lang.author, iconURL: interaction.member.user.displayAvatarURL() })
      .setTitle(lang.title)
      .setDescription(lang.description(langCode))
      .setFooter({ text: 'SuitBot', iconURL: interaction.client.user.displayAvatarURL() })

    await interaction.reply({ embeds: [embed] })
  }
}
