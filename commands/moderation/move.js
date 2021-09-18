const { SlashCommandBuilder } = require('@discordjs/builders')
const { simpleEmbed } = require('../../utilities')
const { GuildMember, MessageEmbed, Permissions } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('move')
    .setDescription('Moves the mentioned user to the specified channel.')
    .addMentionableOption(option =>
      option.setName('user')
        .setDescription('The user to move.')
        .setRequired(true))
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('The channel to move to.')
        .setRequired(true)),
  async execute (interaction) {
    const member = interaction.options.getMentionable('user')
    const channel = interaction.options.getChannel('channel')

    if (!interaction.user.permissions.has(Permissions.FLAGS.MOVE_MEMBERS)) {
      return await interaction.reply(simpleEmbed('You do not have permission to execute this command!', true))
    }
    if (!channel.isVoice()) {
      return await interaction.reply(simpleEmbed('You can only specify a voice channel!', true))
    }
    if (!(member instanceof GuildMember)) {
      return await interaction.reply(simpleEmbed('You can only specify a valid user!', true))
    }

    await member.voice.setChannel(channel)

    const embed = new MessageEmbed()
      .setAuthor('Moved User', interaction.member.user.displayAvatarURL())
      .setTitle(`${member.displayName} → ${channel.name}`)
      .setThumbnail(member.user.displayAvatarURL({ format: 'png', size: 1024 }))
      .setDescription(`Moved \`${member.displayName}\` to \`${channel.name}\`.`)
      .setFooter('SuitBot', interaction.client.user.displayAvatarURL())

    await interaction.reply({ embeds: [embed] })
  }
}
