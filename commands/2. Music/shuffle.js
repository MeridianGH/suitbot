import { SlashCommandBuilder } from '@discordjs/builders'
import { errorEmbed, simpleEmbed } from '../../utilities/utilities.js'
import { getLanguage } from '../../language/locale.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('shuffle')
    .setDescription('Shuffles the queue.'),
  async execute(interaction) {
    const lang = getLanguage(await interaction.client.database.getLocale(interaction.guildId)).shuffle
    const player = interaction.client.lavalink.getPlayer(interaction.guild.id)
    if (!player || !player.current) { return await interaction.reply(errorEmbed(lang.errors.nothingPlaying, true)) }
    if (interaction.member.voice.channel.id !== player.voiceChannel) { return await interaction.reply(errorEmbed(lang.errors.sameChannel, true)) }

    player.queue.shuffle()
    await interaction.reply(simpleEmbed('🔀 ' + lang.other.response))
    interaction.client.dashboard.update(player)
  }
}
