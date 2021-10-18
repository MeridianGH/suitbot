const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with the current latency.'),
  async execute (interaction) {
    const message = await interaction.reply({ embeds: [new MessageEmbed().setDescription('Pinging...')], fetchReply: true })
    const ping = message.createdTimestamp - interaction.createdTimestamp

    const embed = new MessageEmbed()
      .setAuthor('Ping', interaction.member.user.displayAvatarURL())
      .setTitle('Bot & API Latency')
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .setDescription(`Ping: ${ping}ms\nAPI Latency: ${Math.round(interaction.client.ws.ping)}ms`)
      .setFooter('SuitBot', interaction.client.user.displayAvatarURL())

    await interaction.editReply({ embeds: [embed] })
  }
}
