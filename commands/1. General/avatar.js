import { SlashCommandBuilder } from '@discordjs/builders'
import { MessageEmbed } from 'discord.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Send\'s specified user\'s avatar.')
    .addMentionableOption((option) => option.setName('user').setDescription('The user to get the avatar from').setRequired(true)),
  async execute(interaction) {

	const user = interaction.options.getMentionable('user')

    const embed = new MessageEmbed()
      .setAuthor({ name: 'avatar', iconURL: interaction.member.user.displayAvatarURL() })
      .setTitle(`${user.user.username}'s avatar`)
      .setImage(user.user.displayAvatarURL())
      .setFooter({ text: 'SuitBot', iconURL: interaction.client.user.displayAvatarURL() })
    await interaction.reply({ embeds: [embed] })
  }
}
