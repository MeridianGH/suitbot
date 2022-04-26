import { SlashCommandBuilder } from '@discordjs/builders'
import { simpleEmbed } from '../../utilities/utilities.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('repeat')
    .setDescription('Sets the current repeat mode.')
    .addIntegerOption((option) => option.setName('mode').setDescription('The mode to set.').setRequired(true)
      .addChoice('None', 0)
      .addChoice('Track', 1)
      .addChoice('Queue', 2)
    ),
  async execute(interaction) {
    const mode = interaction.options.getInteger('mode')
    const queue = interaction.client.player.getQueue(interaction.guild.id)
    if (!queue || !queue.playing) { return await interaction.reply(simpleEmbed('Nothing currently playing.\nStart playback with /play!', true)) }
    if (interaction.member.voice.channel !== queue.connection.channel) { return await interaction.reply(simpleEmbed('You need to be in the same voice channel as the bot to use this command!', true)) }

    queue.setRepeatMode(mode)
    await interaction.reply(simpleEmbed(`Set repeat mode to ${{ 0: 'None ▶', 1: 'Track 🔂', 2: 'Queue 🔁' }[mode]}`))
  }
}
