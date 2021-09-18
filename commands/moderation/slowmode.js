const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, Permissions } = require('discord.js')
const { simpleEmbed } = require('../../utilities')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Sets the rate limit of the current channel.')
    .addIntegerOption(option =>
      option.setName('seconds')
        .setDescription('The new rate limit in seconds.')),
  async execute (interaction) {
    const seconds = interaction.options.getInteger('seconds')

    if (!interaction.user.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
      return await interaction.reply(simpleEmbed('You do not have permission to execute this command!', true))
    }

    await interaction.channel.setRateLimitPerUser(seconds)

    const embed = new MessageEmbed()
      .setAuthor('Set Slowmode', interaction.member.user.displayAvatarURL())
      .setTitle(`#${interaction.channel.name}`)
      .setThumbnail(interaction.guild.iconURL())
      .setDescription(`Set the rate limit of #${interaction.channel.name} to ${seconds}s.`)
      .setFooter('SuitBot', interaction.client.user.displayAvatarURL())

    await interaction.reply({ embeds: [embed] })
  }
}
