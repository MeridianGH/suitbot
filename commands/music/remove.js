const { SlashCommandBuilder } = require('@discordjs/builders')
const { simpleEmbed } = require('../../utilities')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Removes the specified track from the queue.')
    .addIntegerOption(option =>
      option.setName('track')
        .setDescription('The track to remove.')
        .setRequired(true)),
  async execute (interaction) {
    const track = interaction.options.getInteger('track')
    const queue = interaction.client.player.getQueue(interaction.guild.id)
    if (!queue) { return await interaction.reply(simpleEmbed('Nothing currently playing.\nStart playback with /play!', true)) }
    queue.remove(track)
    await interaction.reply(`🗑️ Removed track \`${track}.\` ${queue.songs[track].name}.`)
  }
}
