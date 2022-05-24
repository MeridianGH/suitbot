import { SlashCommandBuilder } from '@discordjs/builders'
import { errorEmbed, simpleEmbed } from '../../utilities/utilities.js'
import { getLanguage } from '../../language/locale.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Removes the specified track from the queue.')
    .addIntegerOption((option) => option.setName('track').setDescription('The track to remove.').setRequired(true)),
  async execute(interaction) {
    const lang = getLanguage(await interaction.client.database.getLocale(interaction.guildId)).remove
    const index = interaction.options.getInteger('track')
    const player = interaction.client.lavalink.getPlayer(interaction.guild.id)
    if (!player) { return await interaction.reply(errorEmbed(lang.errors.nothingPlaying, true)) }
    if (interaction.member.voice.channel.id !== player.voiceChannel) { return await interaction.reply(errorEmbed(lang.errors.sameChannel, true)) }

    if (index < 1 || index > player.queue.length) { return await interaction.reply(errorEmbed(lang.errors.index(player.queue.length), true)) }
    const track = player.queue.remove(index - 1)[0]
    await interaction.reply(simpleEmbed('🗑️ ' + lang.other.response(`\`#${index}\`: **${track.title}**`)))
    interaction.client.dashboard.update(player)
  }
}
