import { SlashCommandBuilder } from '@discordjs/builders'
import { msToHMS, simpleEmbed, timeToMs } from '../../utilities/utilities.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('seek')
    .setDescription('Skips to the specified point in the current track.')
    .addStringOption(option => option.setName('time').setDescription('The time to skip to. Can be seconds or HH:MM:SS.').setRequired(true)),
  async execute (interaction) {
    const time = timeToMs(interaction.options.getString('time'))
    const queue = interaction.client.player.getQueue(interaction.guild.id)
    if (!queue || !queue.playing) { return await interaction.reply(simpleEmbed('Nothing currently playing.\nStart playback with /play!', true)) }
    if (interaction.member.voice.channel !== queue.connection.channel) { return await interaction.reply(simpleEmbed('You need to be in the same voice channel as the bot to use this command!', true)) }
    if (queue.nowPlaying.live) { return await interaction.reply(simpleEmbed('You can\'t seek in a livestream!', true)) }
    if (time < 0 || time > queue.nowPlaying.milliseconds) { return await interaction.reply(simpleEmbed(`You can only seek between 0:00-${queue.nowPlaying.duration}!`, true)) }

    await queue.seek(time)
    await interaction.reply(simpleEmbed(`⏩ Skipped to ${msToHMS(time)}.`))
  }
}
