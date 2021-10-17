const { SlashCommandBuilder } = require('@discordjs/builders')
const { simpleEmbed } = require('../../utilities')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Removes the specified track from the queue.')
    .addIntegerOption(option => option.setName('track').setDescription('The track to remove.').setRequired(true)),
  async execute (interaction) {
    const track = interaction.options.getInteger('track')
    const queue = interaction.client.player.getQueue(interaction.guild.id)
    if (!queue || !queue.nowPlaying) { return await interaction.reply(simpleEmbed('Nothing currently playing.\nStart playback with /play!', true)) }
    if (track < 1 || track > queue.songs.length - 1) { return await interaction.reply(simpleEmbed(`You can only specify a song number between 1-${queue.songs.length - 1}`, true)) }
    const song = queue.remove(track)
    await interaction.reply(simpleEmbed(`🗑️ Removed track \`#${track}\`: **${song.name}**.`))
  }
}
