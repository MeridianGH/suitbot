import { SlashCommandBuilder } from '@discordjs/builders'
import { simpleEmbed } from '../../utilities.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pauses or resumes playback.'),
  async execute (interaction) {
    const queue = interaction.client.player.getQueue(interaction.guild.id)
    if (!queue || !queue.playing) { return await interaction.reply(simpleEmbed('Nothing currently playing.\nStart playback with /play!', true)) }
    if (interaction.member.voice.channel !== queue.connection.channel) { return await interaction.reply(simpleEmbed('You need to be in the same voice channel as the bot to use this command!', true)) }

    queue.setPaused(!queue.connection.paused)
    await interaction.reply(simpleEmbed(queue.paused ? '⏸ Paused.' : '▶ Resumed.'))
  }
}
