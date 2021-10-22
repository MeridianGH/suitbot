const { SlashCommandBuilder } = require('@discordjs/builders')
const { simpleEmbed } = require('../../utilities')
const { MessageEmbed, Permissions } = require('discord.js')
const { ChannelType } = require('discord-api-types/v9')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('moveall')
    .setDescription('Moves all users from the first channel to the second channel.')
    .addChannelOption(option => option.setName('channel1').setDescription('The channel to move from.').addChannelType(ChannelType.GuildVoice).setRequired(true))
    .addChannelOption(option => option.setName('channel2').setDescription('The channel to move to.').addChannelType(ChannelType.GuildVoice).setRequired(true)),
  async execute (interaction) {
    const channel1 = interaction.options.getChannel('channel1')
    const channel2 = interaction.options.getChannel('channel2')

    if (!interaction.user.permissions.has(Permissions.FLAGS.MOVE_MEMBERS)) { return await interaction.reply(simpleEmbed('You do not have permission to execute this command!', true)) }
    // Will be obsolete with channel types
    if (!channel1.isVoice() || !channel2.isVoice()) { return await interaction.reply(simpleEmbed('You can only specify a voice channel!', true)) }

    for (const user of channel1.members) {
      await user[1].voice.setChannel(channel2)
    }

    const embed = new MessageEmbed()
      .setAuthor('Moved All Users', interaction.member.user.displayAvatarURL())
      .setTitle(`${channel1.name} → ${channel2.name}`)
      .setThumbnail(interaction.guild.iconURL())
      .setDescription(`Moved all users from \`${channel1.name}\` to \`${channel2.name}\`.`)
      .setFooter('SuitBot', interaction.client.user.displayAvatarURL())

    await interaction.reply({ embeds: [embed] })
  }
}
