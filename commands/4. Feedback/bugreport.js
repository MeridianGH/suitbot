import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { simpleEmbed } from '../../utilities/utilities.js'
import { guildId } from '../../utilities/config.js'
import { getLanguage } from '../../language/locale.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('bugreport')
    .setDescription('Reports a bug to the developer.')
    .addStringOption((option) => option.setName('bug').setDescription('A description of the bug.').setRequired(true)),
  async execute(interaction) {
    const lang = getLanguage(await interaction.client.database.getLocale(interaction.guildId)).bugreport
    const bug = interaction.options.getString('bug')
    const developerGuild = interaction.client.guilds.cache.get(guildId)
    const bugReportChannel = developerGuild.channels.cache.find((channel) => channel.name === 'bug-reports' && channel.isTextBased())

    const embed = new EmbedBuilder()
      .setAuthor({ name: 'Bug report received', iconURL: interaction.member.user.displayAvatarURL() })
      .setTitle(`By \`${interaction.member.user.tag}\` in \`${interaction.guild.name}\``)
      .setDescription(bug)
      .setFooter({ text: 'SuitBot', iconURL: interaction.client.user.displayAvatarURL() })

    bugReportChannel?.send({ embeds: [embed] })

    await interaction.reply(simpleEmbed(lang.other.response))
  }
}
