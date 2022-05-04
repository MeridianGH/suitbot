import { SlashCommandBuilder } from '@discordjs/builders'
import { MessageEmbed } from 'discord.js'
import locale from '../../language/locale.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with the current latency.'),
  async execute(interaction) {
    const { ping: lang } = locale[await interaction.client.database.getLocale(interaction.guildId)]
    const embed = new MessageEmbed()
      .setAuthor({ name: lang.author, iconURL: interaction.member.user.displayAvatarURL() })
      .setTitle(lang.title)
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .setDescription('Ping: Pinging...\nAPI Latency: Pinging...')
      .setFooter({ text: 'SuitBot', iconURL: interaction.client.user.displayAvatarURL() })

    const message = await interaction.reply({ embeds: [embed], fetchReply: true })
    const ping = message.createdTimestamp - interaction.createdTimestamp

    embed.setDescription(`Ping: ${ping}ms\nAPI Latency: ${Math.round(interaction.client.ws.ping)}ms`)
    await interaction.editReply({ embeds: [embed] })
  }
}
