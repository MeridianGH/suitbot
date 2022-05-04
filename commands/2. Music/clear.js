import { SlashCommandBuilder } from '@discordjs/builders'
import { simpleEmbed } from '../../utilities/utilities.js'
import locale from '../../language/locale.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Clears the queue.'),
  async execute(interaction) {
    const { clear: lang } = locale[await interaction.client.database.getLocale(interaction.guildId)]
    const queue = interaction.client.player.getQueue(interaction.guild.id)
    if (!queue || !queue.playing) { return await interaction.reply(simpleEmbed(lang.errors.nothingPlaying, true)) }
    if (interaction.member.voice.channel !== queue.connection.channel) { return await interaction.reply(simpleEmbed(lang.errors.sameChannel, true)) }

    queue.clear()
    await interaction.reply(simpleEmbed('🗑️ ' + lang.other.response))
  }
}
