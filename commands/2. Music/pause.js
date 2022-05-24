import { SlashCommandBuilder } from '@discordjs/builders'
import { errorEmbed, simpleEmbed } from '../../utilities/utilities.js'
import { getLanguage } from '../../language/locale.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pauses or resumes playback.'),
  async execute(interaction) {
    const lang = getLanguage(await interaction.client.database.getLocale(interaction.guildId)).nowplaying
    const player = interaction.client.lavalink.getPlayer(interaction.guild.id)
    if (!player) { return await interaction.reply(errorEmbed(lang.errors.nothingPlaying, true)) }
    if (interaction.member.voice.channel.id !== player.voiceChannel) { return await interaction.reply(errorEmbed(lang.errors.sameChannel, true)) }

    player.pause(!player.paused)
    await interaction.reply(simpleEmbed(player.paused ? '⏸ ' + lang.other.paused : '▶ ' + lang.other.resumed))
    interaction.client.dashboard.update(player)
  }
}
