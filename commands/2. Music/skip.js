import { SlashCommandBuilder } from '@discordjs/builders'
import { errorEmbed, simpleEmbed } from '../../utilities/utilities.js'
import locale from '../../language/locale.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skips the current track or to a specified point in the queue.')
    .addIntegerOption((option) => option.setName('track').setDescription('The track to skip to.')),
  async execute(interaction) {
    const { skip: lang } = locale[await interaction.client.database.getLocale(interaction.guildId)]
    const index = interaction.options.getInteger('track')
    const queue = interaction.client.player.getQueue(interaction.guild.id)
    if (!queue || !queue.playing) { return await interaction.reply(errorEmbed(lang.errors.nothingPlaying, true)) }
    if (interaction.member.voice.channel !== queue.connection.channel) { return await interaction.reply(errorEmbed(lang.errors.sameChannel, true)) }

    if (index) {
      const track = queue.tracks[queue.tracks.indexOf(index)]
      queue.skip(index)
      await interaction.reply(simpleEmbed('⏭ ' + lang.other.skippedTo(`\`#${index}\`: **${track.title}**`)))
    } else {
      queue.skip()
      await interaction.reply(simpleEmbed('⏭ ' + lang.other.skipped))
    }
  }
}
