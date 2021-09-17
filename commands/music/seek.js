const { SlashCommandBuilder } = require('@discordjs/builders')
const { simpleEmbed, msToHMS } = require('../../utilities')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('seek')
    .setDescription('Skips to the specified point in the current track.')
    .addIntegerOption(option =>
      option.setName('seconds')
        .setDescription('The seconds to skip to.')
        .setRequired(true)),
  async execute (interaction) {
    const seconds = interaction.options.getInteger('seconds')
    const queue = interaction.client.player.getQueue(interaction.guild.id)
    if (!queue) { return await interaction.reply(simpleEmbed('Nothing currently playing.\nStart playback with /play!', true)) }
    await queue.seek(seconds * 1000)
    await interaction.reply(`⏩ Skipped to ${msToHMS(seconds)}.`)
  }
}
