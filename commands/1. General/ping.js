const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with the current latency.'),
  async execute (interaction) {
    const embed = new MessageEmbed()
      .setAuthor({ name: 'Ping', iconURL: interaction.member.user.displayAvatarURL() })
      .setTitle('Bot & API Latency')
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .setDescription('Ping: Pinging...\nAPI Latency: Pinging...')
      .setFooter({ text: 'SuitBot', iconURL: interaction.client.user.displayAvatarURL() })

    const message = await interaction.reply({ embeds: [embed], fetchReply: true })
    const ping = message.createdTimestamp - interaction.createdTimestamp

    embed.setDescription(`Ping: ${ping}ms\nAPI Latency: ${Math.round(interaction.client.ws.ping)}ms`)
    await interaction.editReply({ embeds: [embed] })
  }
}
