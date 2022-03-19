const { SlashCommandBuilder } = require('@discordjs/builders')
const { simpleEmbed } = require('../../utilities')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('previous')
    .setDescription('Plays the previous track.'),
  async execute (interaction) {
    const queue = interaction.client.player.getQueue(interaction.guild.id)
    if (!queue || !queue.playing) { return await interaction.reply(simpleEmbed('Nothing currently playing.\nStart playback with /play!', true)) }
    if (interaction.member.voice.channel !== queue.connection.channel) { return await interaction.reply(simpleEmbed('You need to be in the same voice channel as the bot to use this command!', true)) }

    return await interaction.reply('not available')
    // TODO: Previous

    try {
      await queue.back()
    } catch (e) {
      return await interaction.reply(simpleEmbed('You can\'t use the command  `previous` right now!', true))
    }

    await interaction.reply(simpleEmbed(`⏮ Playing previous track \`#0\`: **${queue.current.title}**.`))
  }
}
