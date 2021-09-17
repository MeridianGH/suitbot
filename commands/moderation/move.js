const { SlashCommandBuilder } = require('@discordjs/builders')
const { simpleEmbed } = require('../../utilities')
const { GuildMember, MessageEmbed } = require('discord.js')

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
    const user = interaction.options.getMentionable('user')
    const channel = interaction.options.getChannel('channel')

    if (!channel.isVoice()) {
      return await interaction.reply(simpleEmbed('You can only specify a voice channel!', true))
    }
    if (!(user instanceof GuildMember)) {
      return await interaction.reply(simpleEmbed('You can only specify a valid user!', true))
    }

    await user.voice.setChannel(channel)

    const embed = new MessageEmbed()
      .setAuthor('Moved User', `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}`)
      .setTitle(`${user.displayName} → ${channel.name}`)
      .setThumbnail(`https://cdn.discordapp.com/avatars/${user.user.id}/${user.user.avatar}`)
      .setDescription(`Moved \`${user.displayName}\` to \`${channel.name}\`.`)
      .setFooter('SuitBot', 'https://cdn.discordapp.com/app-icons/887122733010411611/78c68033a9da502750c5165029b57817.png')

    await interaction.reply({ embeds: [embed] })
  }
}
