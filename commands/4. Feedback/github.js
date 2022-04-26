import { SlashCommandBuilder } from '@discordjs/builders'
import { MessageEmbed } from 'discord.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('github')
    .setDescription('Sends a link to the source code of this bot.'),
  async execute(interaction) {
    const embed = new MessageEmbed()
      .setAuthor({ name: 'GitHub', iconURL: interaction.member.user.displayAvatarURL() })
      .setTitle('GitHub Repository')
      .setURL('https://github.com/MeridianGH/suitbot')
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .setDescription('The source code for this bot along with helpful information.')
      .setFooter({ text: 'SuitBot', iconURL: interaction.client.user.displayAvatarURL() })
    await interaction.reply({ embeds: [embed] })
  }
}
