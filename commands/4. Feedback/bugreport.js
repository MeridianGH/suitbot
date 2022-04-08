import { SlashCommandBuilder } from '@discordjs/builders'
import { simpleEmbed } from '../../utilities.js'
import { MessageEmbed } from 'discord.js'
import { guildId } from '../../config.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('bugreport')
    .setDescription('Reports a bug to the developer.')
    .addStringOption(option => option.setName('bug').setDescription('A description of the bug.').setRequired(true)),
  async execute (interaction) {
    const bug = interaction.options.getString('bug')
    const developerGuild = interaction.client.guilds.cache.get(guildId)
    const bugReportChannel = developerGuild.channels.cache.find(channel => (channel.name === 'bug-reports') && channel.isText())

    const embed = new MessageEmbed()
      .setAuthor({ name: 'Bug report received', iconURL: interaction.member.user.displayAvatarURL() })
      .setTitle(`By \`${interaction.member.user.tag}\` in \`${interaction.guild.name}\``)
      .setDescription(bug)
      .setFooter({ text: 'SuitBot', iconURL: interaction.client.user.displayAvatarURL() })

    bugReportChannel?.send({ embeds: [embed] })

    await interaction.reply(simpleEmbed('Your bug report was sent successfully!'))
  }
}
