import { SlashCommandBuilder } from '@discordjs/builders'
import { errorEmbed, simpleEmbed } from '../../utilities/utilities.js'
import { getLanguage } from '../../language/locale.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('previous')
    .setDescription('Plays the previous track.'),
  async execute(interaction) {
    const lang = getLanguage(await interaction.client.database.getLocale(interaction.guildId)).previous
    const player = interaction.client.lavalink.getPlayer(interaction.guild.id)
    if (!player) { return await interaction.reply(errorEmbed(lang.errors.nothingPlaying, true)) }
    if (interaction.member.voice.channel.id !== player.voiceChannel) { return await interaction.reply(errorEmbed(lang.errors.sameChannel, true)) }

    if (player.previousTracks.length === 0) { return await interaction.reply(errorEmbed(lang.errors.generic, true)) }

    const track = player.previousTracks.pop()
    player.queue.add(track, 0)
    player.manager.once('trackEnd', (player) => { player.queue.add(player.previousTracks.pop(), 0) })
    player.stop()

    await interaction.reply(simpleEmbed('⏮ ' + lang.other.response(`\`#0\`: **${track.title}**`)))
    interaction.client.dashboard.update(player)
  }
}
