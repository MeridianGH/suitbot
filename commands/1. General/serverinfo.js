const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Shows info about the server.'),
  async execute (interaction) {
    const guild = interaction.guild
    const description =
`**Created:** ${guild.createdAt.toUTCString()}
**Channels:** ${guild.channels.channelCountWithoutThreads}
**Members:** ${guild.memberCount}
**Boosts:** ${guild.premiumSubscriptionCount ?? 0}
**Owner:** ${await guild.fetchOwner().then(member => { return member.user.tag })}
**ID:** ${guild.id}`

    const embed = new MessageEmbed()
      .setAuthor('Server Information', interaction.member.user.displayAvatarURL())
      .setTitle(guild.name)
      .setThumbnail(guild.iconURL())
      .setDescription(description)
      .setFooter('SuitBot', interaction.client.user.displayAvatarURL())

    await interaction.reply({ embeds: [embed] })
  }
}
