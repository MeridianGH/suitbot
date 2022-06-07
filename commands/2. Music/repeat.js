import { SlashCommandBuilder } from '@discordjs/builders'
import { errorEmbed, simpleEmbed } from '../../utilities/utilities.js'
import { getLanguage } from '../../language/locale.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('repeat')
    .setDescription('Sets the current repeat mode.')
    .addStringOption((option) => option.setName('mode').setDescription('The mode to set.').setRequired(true).addChoices(
      { name: 'None', value: 'none' },
      { name: 'Track', value: 'track' },
      { name: 'Queue', value: 'queue' }
    )),
  async execute(interaction) {
    const lang = getLanguage(await interaction.client.database.getLocale(interaction.guildId)).repeat
    const mode = interaction.options.getString('mode')
    const player = interaction.client.lavalink.getPlayer(interaction.guild.id)
    if (!player || !player.current) { return await interaction.reply(errorEmbed(lang.errors.nothingPlaying, true)) }
    if (interaction.member.voice.channel.id !== player.voiceChannel) { return await interaction.reply(errorEmbed(lang.errors.sameChannel, true)) }

    mode === 'track' ? player.setTrackRepeat(true) : mode === 'queue' ? player.setQueueRepeat(true) : player.setTrackRepeat(false)
    await interaction.reply(simpleEmbed(lang.other.response(player.queueRepeat ? lang.other.repeatModes.queue + ' 🔁' : player.trackRepeat ? lang.other.repeatModes.track + ' 🔂' : lang.other.repeatModes.none + ' ▶')))
    interaction.client.dashboard.update(player)
  }
}
