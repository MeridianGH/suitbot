import { SlashCommandBuilder } from '@discordjs/builders'
import { MessageEmbed } from 'discord.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Sends an invite link for the bot.'),
  async execute (interaction) {
    const embed = new MessageEmbed()
      .setAuthor({ name: 'Invite', iconURL: interaction.member.user.displayAvatarURL() })
      .setTitle('Invite SuitBot')
      .setURL('https://discord.com/oauth2/authorize?client_id=887122733010411611&scope=bot%20applications.commands&permissions=2167425024')
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .setDescription('Click this link to invite SuitBot to your server!')
      .setFooter({ text: 'SuitBot', iconURL: interaction.client.user.displayAvatarURL() })
    await interaction.reply({ embeds: [embed] })
  }
}
