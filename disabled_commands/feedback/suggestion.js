import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { simpleEmbed } from '../../utilities/utilities.js'
import { guildId } from '../../utilities/config.js'
import { getLanguage } from '../../language/locale.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('suggestion')
    .setDescription('Sends a suggestion to the developer.')
    .addStringOption((option) => option.setName('suggestion').setDescription('The suggestion to send.').setRequired(true)),
  async execute(interaction) {
    const lang = getLanguage(await interaction.client.database.getLocale(interaction.guildId)).suggestion
    const suggestion = interaction.options.getString('suggestion')
    const developerGuild = interaction.client.guilds.cache.get(guildId)
    const suggestionChannel = developerGuild.channels.cache.find((channel) => channel.name === 'suggestions' && channel.isTextBased())

    const embed = new EmbedBuilder()
      .setAuthor({ name: 'Suggestion received', iconURL: interaction.member.user.displayAvatarURL() })
      .setTitle(`By \`${interaction.member.user.tag}\` in \`${interaction.guild.name}\``)
      .setDescription(suggestion)
      .setFooter({ text: 'SuitBot', iconURL: interaction.client.user.displayAvatarURL() })

    suggestionChannel?.send({ embeds: [embed], fetchReply: true }).then(async (message) => { await message.react('✅'); await message.react('❌') })

    await interaction.reply(simpleEmbed(lang.other.response))
  }
}
