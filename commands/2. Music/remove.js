const { SlashCommandBuilder } = require('@discordjs/builders')
const { simpleEmbed } = require('../../utilities')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Removes the specified track from the queue.')
    .addIntegerOption(option => option.setName('track').setDescription('The track to remove.').setRequired(true)),
  async execute (interaction) {
    const index = interaction.options.getInteger('track')
    const queue = interaction.client.player.getQueue(interaction.guild.id)
    if (!queue || !queue.playing) { return await interaction.reply(simpleEmbed('Nothing currently playing.\nStart playback with /play!', true)) }
    if (interaction.member.voice.channel !== queue.connection.channel) { return await interaction.reply(simpleEmbed('You need to be in the same voice channel as the bot to use this command!', true)) }

    if (index < 1 || index > queue.tracks.length) { return await interaction.reply(simpleEmbed(`You can only specify a song number between 1-${queue.tracks.length}`, true)) }
    const track = queue.remove(index - 1)
    await interaction.reply(simpleEmbed(`🗑️ Removed track \`#${index - 1}\`: **${track.title}**.`))
  }
}
