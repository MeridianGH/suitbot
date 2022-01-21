const { SlashCommandBuilder } = require('@discordjs/builders')
const { simpleEmbed } = require('../../utilities')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skips the current song or to a specified track.')
    .addIntegerOption(option => option.setName('track').setDescription('The track to skip to.')),
  async execute (interaction) {
    const queue = interaction.client.player.getQueue(interaction.guild.id)
    const track = interaction.options.getInteger('track')
    if (!queue || !queue.nowPlaying) { return await interaction.reply(simpleEmbed('Nothing currently playing.\nStart playback with /play!', true)) }
    if (!(interaction.user.voice.channel === queue.connection.channel)) { return await interaction.reply(simpleEmbed('You need to be in the same voice channel as the bot to use this command!', true)) }

    if (track) {
      queue.skip(track - 1)
      await interaction.reply(simpleEmbed(`⏭ Skipped to \`#${track}\`: **${queue.songs[1].name}**.`))
    } else {
      queue.skip()
      await interaction.reply(simpleEmbed('⏭ Skipped.'))
    }
  }
}
