const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const { timeSince } = require('../../utilities')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Shows info about the server.'),
  async execute (interaction) {
    const guild = interaction.guild

    const embed = new MessageEmbed()
      .setAuthor('Server Information', interaction.member.user.displayAvatarURL())
      .setTitle(guild.name)
      .setThumbnail(guild.iconURL())
      .addField('Members', guild.memberCount.toString(), true)
      .addField('Channels', guild.channels.channelCountWithoutThreads.toString(), true)
      .addField('Boosts', guild.premiumSubscriptionCount.toString() ?? '0', true)
      .addField('Owner', `<@${guild.ownerId}>`, true)
      .addField('Guild ID', guild.id, true)
      .addField('\u200b', '\u200b', true)
      .addField('Created', `${guild.createdAt.toUTCString()} (${timeSince(guild.createdAt)})`)
      .setFooter('SuitBot', interaction.client.user.displayAvatarURL())

    await interaction.reply({ embeds: [embed] })
  }
}
