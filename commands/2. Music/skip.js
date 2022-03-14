const { SlashCommandBuilder } = require('@discordjs/builders')
const { simpleEmbed } = require('../../utilities')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skips the current track or to a specified point in the queue.')
    .addIntegerOption(option => option.setName('track').setDescription('The track to skip to.')),
  async execute (interaction) {
    const index = interaction.options.getInteger('track')
    const queue = interaction.client.player.getQueue(interaction.guild.id)
    if (!queue || !queue.playing) { return await interaction.reply(simpleEmbed('Nothing currently playing.\nStart playback with /play!', true)) }
    if (interaction.member.voice.channel !== queue.connection.channel) { return await interaction.reply(simpleEmbed('You need to be in the same voice channel as the bot to use this command!', true)) }

    if (index) {
      const track = queue.tracks[queue.getTrackPosition(index - 1)]
      queue.skipTo(index - 1)
      await interaction.reply(simpleEmbed(`⏭ Skipped to \`#${index}\`: **${track.title}**.`))
    } else {
      queue.skip()
      await interaction.reply(simpleEmbed('⏭ Skipped.'))
    }
  }
}
