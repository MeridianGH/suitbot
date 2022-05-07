import { SlashCommandBuilder } from '@discordjs/builders'
import { errorEmbed, simpleEmbed } from '../../utilities/utilities.js'
import { getLanguage } from '../../language/locale.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('previous')
    .setDescription('Plays the previous track.'),
  async execute(interaction) {
    const lang = getLanguage(await interaction.client.database.getLocale(interaction.guildId)).previous
    const queue = interaction.client.player.getQueue(interaction.guild.id)
    if (!queue || !queue.playing) { return await interaction.reply(errorEmbed(lang.errors.nothingPlaying, true)) }
    if (interaction.member.voice.channel !== queue.connection.channel) { return await interaction.reply(errorEmbed(lang.errors.sameChannel, true)) }

    const track = queue.previous()
    if (!track) { return await interaction.reply(errorEmbed(lang.errors.generic, true)) }

    await interaction.reply(simpleEmbed('⏮ ' + lang.other.response(`\`#0\`: **${queue.nowPlaying.title}**`)))
  }
}
