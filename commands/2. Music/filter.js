import { SlashCommandBuilder } from '@discordjs/builders'
import { errorEmbed, simpleEmbed } from '../../utilities/utilities.js'
import { getLanguage } from '../../language/locale.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('filter')
    .setDescription('Sets filter modes for the player.')
    .addStringOption((option) => option.setName('filter').setDescription('The filter to select.').setRequired(true).addChoices([
      [ 'None', 'none' ],
      [ 'Bass Boost', 'bassboost' ],
      [ 'Classic', 'classic' ],
      [ '8D', 'eightd' ],
      [ 'Earrape', 'earrape' ],
      [ 'Karaoke', 'karaoke' ],
      [ 'Nightcore', 'nightcore' ],
      [ 'Superfast', 'superfast' ],
      [ 'Vaporwave', 'vaporwave' ]
    ])),
  async execute(interaction) {
    const lang = getLanguage(await interaction.client.database.getLocale(interaction.guildId)).filter
    const filter = interaction.options.getString('filter')
    const player = interaction.client.lavalink.getPlayer(interaction.guild.id)
    if (!player || !player.current) { return await interaction.reply(errorEmbed(lang.errors.nothingPlaying, true)) }
    if (interaction.member.voice.channel.id !== player.voiceChannel) { return await interaction.reply(errorEmbed(lang.errors.sameChannel, true)) }

    // noinspection JSUnresolvedFunction
    player.setFilter(filter)
    await interaction.reply(simpleEmbed(lang.other.response(filter)))
    interaction.client.dashboard.update(player)
  }
}
