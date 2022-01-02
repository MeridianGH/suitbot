const { SlashCommandBuilder } = require('@discordjs/builders')
const { simpleEmbed, msToHMS } = require('../../utilities')
const { Utils } = require('discord-music-player')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('seek')
    .setDescription('Skips to the specified point in the current track.')
    .addStringOption(option => option.setName('time').setDescription('The time to skip to. Can be seconds or HH:MM:SS.').setRequired(true)),
  async execute (interaction) {
    const time = interaction.options.getString('time')
    const milliseconds = isNaN(time) ? Utils.timeToMs(time) : time * 1000
    const queue = interaction.client.player.getQueue(interaction.guild.id)
    if (!queue || !queue.nowPlaying) { return await interaction.reply(simpleEmbed('Nothing currently playing.\nStart playback with /play!', true)) }
    if (milliseconds < 0 || milliseconds > queue.nowPlaying.milliseconds) { return await interaction.reply(simpleEmbed(`You can only seek between 0:00-${queue.nowPlaying.duration}!`, true)) }
    await queue.seek(milliseconds)
    await interaction.reply(simpleEmbed(`⏩ Skipped to ${msToHMS(milliseconds)}.`))
  }
}
