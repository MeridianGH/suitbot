const { SlashCommandBuilder } = require('@discordjs/builders')
const { simpleEmbed } = require('../../utilities')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('previous')
    .setDescription('Plays the previously played track again.'),
  async execute (interaction) {
    const queue = interaction.client.player.getQueue(interaction.guild.id)
    if (!queue || !queue.nowPlaying) { return await interaction.reply(simpleEmbed('Nothing currently playing.\nStart playback with /play!', true)) }
    if (!queue.data.previous) { return await interaction.reply(simpleEmbed('You can\'t use the `previous` command right now!', true)) }
    await queue.play(queue.data.previous, { index: 0 })
    await queue.play(queue.nowPlaying, { index: 1 })
    queue.skip()
    await interaction.reply(simpleEmbed('⏭ Skipped to previous song.'))
  }
}