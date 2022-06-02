import { SlashCommandBuilder } from '@discordjs/builders'
import { errorEmbed, simpleEmbed } from '../../utilities/utilities.js'
import { getLanguage } from '../../language/locale.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Sets the volume of the music player.')
    .addIntegerOption((option) => option.setName('volume').setDescription('The volume to set the player to.').setRequired(true)),
  async execute(interaction) {
    const lang = getLanguage(await interaction.client.database.getLocale(interaction.guildId)).volume
    const volume = Math.min(Math.max(interaction.options.getInteger('volume'), 0), 100)
    const player = interaction.client.lavalink.getPlayer(interaction.guild.id)
    if (!player || !player.current) { return await interaction.reply(errorEmbed(lang.errors.nothingPlaying, true)) }
    if (interaction.member.voice.channel.id !== player.voiceChannel) { return await interaction.reply(errorEmbed(lang.errors.sameChannel, true)) }

    player.setVolume(volume)
    await interaction.reply(simpleEmbed('🔊 ' + lang.other.response(volume)))
    interaction.client.dashboard.update(player)
  }
}
