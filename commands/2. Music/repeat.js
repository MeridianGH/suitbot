import { SlashCommandBuilder } from '@discordjs/builders'
import { errorEmbed, simpleEmbed } from '../../utilities/utilities.js'
import { getLanguage } from '../../language/locale.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('repeat')
    .setDescription('Sets the current repeat mode.')
    .addIntegerOption((option) => option.setName('mode').setDescription('The mode to set.').setRequired(true)
      .addChoice('None', 0)
      .addChoice('Track', 1)
      .addChoice('Queue', 2)
    ),
  async execute(interaction) {
    const lang = getLanguage(await interaction.client.database.getLocale(interaction.guildId)).repeat
    const mode = interaction.options.getInteger('mode')
    const queue = interaction.client.player.getQueue(interaction.guild.id)
    if (!queue || !queue.playing) { return await interaction.reply(errorEmbed(lang.errors.nothingPlaying, true)) }
    if (interaction.member.voice.channel !== queue.connection.channel) { return await interaction.reply(errorEmbed(lang.errors.sameChannel, true)) }

    queue.setRepeatMode(mode)
    await interaction.reply(simpleEmbed(lang.other.response({ 0: lang.other.repeatModes.none + ' ▶', 1: lang.other.repeatModes.track + ' 🔂', 2: lang.other.repeatModes.queue + ' 🔁' }[mode])))
  }
}
