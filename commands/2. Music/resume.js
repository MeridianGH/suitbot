import { SlashCommandBuilder } from '@discordjs/builders'
import { simpleEmbed } from '../../utilities/utilities.js'
import locale from '../../language/locale.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Resumes playback.'),
  async execute(interaction) {
    const { resume: lang } = locale[await interaction.client.database.getLocale(interaction.guildId)]
    const queue = interaction.client.player.getQueue(interaction.guild.id)
    if (!queue || !queue.playing) { return await interaction.reply(simpleEmbed(lang.errors.nothingPlaying, true)) }
    if (interaction.member.voice.channel !== queue.connection.channel) { return await interaction.reply(simpleEmbed(lang.errors.sameChannel, true)) }
    if (!queue.paused) { return await interaction.reply(simpleEmbed(lang.errors.notPaused, true)) }

    queue.setPaused(false)
    await interaction.reply(simpleEmbed('▶ ' + lang.other.response))
  }
}
