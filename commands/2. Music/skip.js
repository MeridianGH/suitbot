import { SlashCommandBuilder } from '@discordjs/builders'
import { errorEmbed, simpleEmbed } from '../../utilities/utilities.js'
import { getLanguage } from '../../language/locale.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skips the current track or to a specified point in the queue.')
    .addIntegerOption((option) => option.setName('track').setDescription('The track to skip to.')),
  async execute(interaction) {
    const { skip: lang, stop } = getLanguage(await interaction.client.database.getLocale(interaction.guildId))
    const index = interaction.options.getInteger('track')
    const player = interaction.client.lavalink.getPlayer(interaction.guild.id)
    if (!player) { return await interaction.reply(errorEmbed(lang.errors.nothingPlaying, true)) }
    if (interaction.member.voice.channel.id !== player.voiceChannel) { return await interaction.reply(errorEmbed(lang.errors.sameChannel, true)) }
    if (index > player.queue.length && player.queue.length > 0) { return await interaction.reply(errorEmbed(lang.errors.index(player.queue.length))) }

    if (player.queue.length === 0) {
      player.destroy()
      await interaction.reply(simpleEmbed('⏹ ' + stop.other.response))
      interaction.client.dashboard.update(player)
      return
    }

    if (index) {
      const track = player.queue[index - 1]
      player.stop(index)
      await interaction.reply(simpleEmbed('⏭ ' + lang.other.skippedTo(`\`#${index}\`: **${track.title}**`)))
    } else {
      player.stop()
      await interaction.reply(simpleEmbed('⏭ ' + lang.other.skipped))
    }
    interaction.client.dashboard.update(player)
  }
}
