import { SlashCommandBuilder } from 'discord.js'
import { errorEmbed, simpleEmbed } from '../../utilities/utilities.js'
import { getLanguage } from '../../language/locale.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Clears the queue.'),
  async execute(interaction) {
    const lang = getLanguage(await interaction.client.database.getLocale(interaction.guildId)).clear
    const player = interaction.client.lavalink.getPlayer(interaction.guild.id)
    if (!player || !player.queue.current) { return await interaction.reply(errorEmbed(lang.errors.nothingPlaying, true)) }
    if (interaction.member.voice.channel?.id !== player.voiceChannel) { return await interaction.reply(errorEmbed(lang.errors.sameChannel, true)) }

    player.queue.clear()
    await interaction.reply(simpleEmbed('🗑️ ' + lang.other.response))
    interaction.client.dashboard.update(player)
  }
}
