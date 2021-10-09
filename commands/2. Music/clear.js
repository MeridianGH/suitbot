const { SlashCommandBuilder } = require('@discordjs/builders')
const { simpleEmbed } = require('../../utilities')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Clears the queue.'),
  async execute (interaction) {
    const queue = interaction.client.player.getQueue(interaction.guild.id)
    if (!queue || !queue.nowPlaying) { return await interaction.reply(simpleEmbed('Nothing currently playing.\nStart playback with /play!', true)) }
    queue.clearQueue()
    await interaction.reply(simpleEmbed('🗑️ Cleared the queue.'))
  }
}
