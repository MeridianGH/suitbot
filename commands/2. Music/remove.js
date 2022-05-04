import { SlashCommandBuilder } from '@discordjs/builders'
import { simpleEmbed } from '../../utilities/utilities.js'
import locale from '../../language/locale.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Removes the specified track from the queue.')
    .addIntegerOption((option) => option.setName('track').setDescription('The track to remove.').setRequired(true)),
  async execute(interaction) {
    const { remove: lang } = locale[await interaction.client.database.getLocale(interaction.guildId)]
    const index = interaction.options.getInteger('track')
    const queue = interaction.client.player.getQueue(interaction.guild.id)
    if (!queue || !queue.playing) { return await interaction.reply(simpleEmbed(lang.errors.nothingPlaying, true)) }
    if (interaction.member.voice.channel !== queue.connection.channel) { return await interaction.reply(simpleEmbed(lang.errors.sameChannel, true)) }

    if (index < 1 || index > queue.tracks.length) { return await interaction.reply(simpleEmbed(lang.errors.index(queue.tracks.length), true)) }
    const track = queue.remove(index)
    await interaction.reply(simpleEmbed('🗑️ ' + lang.other.response(`\`#${index}\`: **${track.title}**`)))
  }
}
