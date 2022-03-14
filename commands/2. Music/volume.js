const { SlashCommandBuilder } = require('@discordjs/builders')
const { simpleEmbed } = require('../../utilities')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Sets the volume of the music player.')
    .addIntegerOption(option => option.setName('volume').setDescription('The volume to set the player to.').setRequired(true)),
  async execute (interaction) {
    const volume = Math.min(Math.max(interaction.options.getInteger('volume'), 0), 100)
    const queue = interaction.client.player.getQueue(interaction.guild.id)
    if (!queue || !queue.playing) { return await interaction.reply(simpleEmbed('Nothing currently playing.\nStart playback with /play!', true)) }
    if (interaction.member.voice.channel !== queue.connection.channel) { return await interaction.reply(simpleEmbed('You need to be in the same voice channel as the bot to use this command!', true)) }

    queue.setVolume(volume)
    await interaction.reply(simpleEmbed(`🔊 Set volume to ${volume}%.`))
  }
}
