const { SlashCommandBuilder } = require('@discordjs/builders')
const { simpleEmbed } = require('../../utilities')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('repeat')
    .setDescription('Sets the current repeat mode.')
    .addIntegerOption(option => option.setName('mode').setDescription('The query to search for.').setRequired(true)
      .addChoice('None', 0)
      .addChoice('Song', 1)
      .addChoice('Queue', 2)),
  async execute (interaction) {
    const mode = interaction.options.getInteger('mode')
    const queue = interaction.client.player.getQueue(interaction.guild.id)
    if (!queue || !queue.nowPlaying) { return await interaction.reply(simpleEmbed('Nothing currently playing.\nStart playback with /play!', true)) }
    if (!(interaction.user.voice.channel === queue.connection.channel)) { return await interaction.reply(simpleEmbed('You need to be in the same voice channel as the bot to use this command!', true)) }

    queue.setRepeatMode(mode)
    await interaction.reply(simpleEmbed(`Set repeat mode to ${mode === 0 ? 'None ▶' : mode === 1 ? 'Song 🔂' : 'Queue 🔁'}`))
  }
}
