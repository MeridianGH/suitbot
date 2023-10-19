import { SlashCommandBuilder } from 'discord.js'
import { errorEmbed, msToHMS, simpleEmbed, timeToMs } from '../../utilities/utilities.js'
import { getLanguage } from '../../language/locale.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('seek')
    .setDescription('Skips to the specified point in the current track.')
    .addStringOption((option) => option.setName('time').setDescription('The time to skip to. Can be seconds or HH:MM:SS.').setRequired(true)),
  async execute(interaction) {
    const lang = getLanguage(await interaction.client.database.getLocale(interaction.guildId)).seek
    const time = timeToMs(interaction.options.getString('time'))
    const player = interaction.client.lavalink.getPlayer(interaction.guild.id)
    if (!player || !player.queue.current) { return await interaction.reply(errorEmbed(lang.errors.nothingPlaying, true)) }
    if (interaction.member.voice.channel?.id !== player.voiceChannel) { return await interaction.reply(errorEmbed(lang.errors.sameChannel, true)) }
    if (player.queue.current.isStream) { return await interaction.reply(errorEmbed(lang.errors.isLive, true)) }
    if (time < 0 || time > player.queue.current.duration) { return await interaction.reply(errorEmbed(lang.errors.index(player.queue.current.duration), true)) }

    player.seek(time)
    await interaction.reply(simpleEmbed('⏩ ' + lang.other.response(msToHMS(time))))
    interaction.client.dashboard.update(player)
  }
}
