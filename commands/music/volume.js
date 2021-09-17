const { SlashCommandBuilder } = require('@discordjs/builders')
const { simpleEmbed } = require('../../utilities')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Sets the volume of the music player.')
    .addIntegerOption(option =>
      option.setName('volume')
        .setDescription('The volume to set the player to.')
        .setRequired(true)),
  async execute (interaction) {
    const volume = interaction.options.getInteger('volume')
    const queue = interaction.client.player.getQueue(interaction.guild.id)
    if (!queue) { return interaction.reply(simpleEmbed('Nothing currently playing.\nStart playback with /play!', true)) }
    queue.setVolume(volume)
    await interaction.reply(`🔊 Set volume to ${volume}%.`)
  }
}
