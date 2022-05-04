import { SlashCommandBuilder } from '@discordjs/builders'
import { simpleEmbed } from '../../utilities/utilities.js'
import locale from '../../language/locale.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Sets the volume of the music player.')
    .addIntegerOption((option) => option.setName('volume').setDescription('The volume to set the player to.').setRequired(true)),
  async execute(interaction) {
    const { volume: lang } = locale[await interaction.client.database.getLocale(interaction.guildId)]
    const volume = Math.min(Math.max(interaction.options.getInteger('volume'), 0), 100)
    const queue = interaction.client.player.getQueue(interaction.guild.id)
    if (!queue || !queue.playing) { return await interaction.reply(simpleEmbed(lang.errors.nothingPlaying, true)) }
    if (interaction.member.voice.channel !== queue.connection.channel) { return await interaction.reply(simpleEmbed(lang.errors.sameChannel, true)) }

    queue.setVolume(volume)
    await interaction.reply(simpleEmbed('🔊 ' + lang.other.response(volume)))
  }
}
