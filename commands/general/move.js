const { SlashCommandBuilder } = require('@discordjs/builders')
const { simpleEmbed } = require('../../utilities')
const { GuildMember } = require('discord.js')

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
    await interaction.reply(simpleEmbed(`Moved \`${user.displayName}\` to \`${channel.name}\`.`))
  }
}
