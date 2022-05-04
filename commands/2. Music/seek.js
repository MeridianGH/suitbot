import { SlashCommandBuilder } from '@discordjs/builders'
import { msToHMS, simpleEmbed, timeToMs } from '../../utilities/utilities.js'
import locale from '../../language/locale.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('seek')
    .setDescription('Skips to the specified point in the current track.')
    .addStringOption((option) => option.setName('time').setDescription('The time to skip to. Can be seconds or HH:MM:SS.').setRequired(true)),
  async execute(interaction) {
    const { seek: lang } = locale[await interaction.client.database.getLocale(interaction.guildId)]
    const time = timeToMs(interaction.options.getString('time'))
    const queue = interaction.client.player.getQueue(interaction.guild.id)
    if (!queue || !queue.playing) { return await interaction.reply(simpleEmbed(lang.errors.nothingPlaying, true)) }
    if (interaction.member.voice.channel !== queue.connection.channel) { return await interaction.reply(simpleEmbed(lang.errors.sameChannel, true)) }
    if (queue.nowPlaying.live) { return await interaction.reply(simpleEmbed(lang.errors.isLive, true)) }
    if (time < 0 || time > queue.nowPlaying.milliseconds) { return await interaction.reply(simpleEmbed(lang.errors.index(queue.nowPlaying.duration), true)) }

    await queue.seek(time)
    await interaction.reply(simpleEmbed('⏩ ' + lang.other.response(msToHMS(time))))
  }
}
