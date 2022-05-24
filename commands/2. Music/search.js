import { SlashCommandBuilder } from '@discordjs/builders'
import { MessageActionRow, MessageEmbed, MessageSelectMenu } from 'discord.js'
import { errorEmbed, msToHMS } from '../../utilities/utilities.js'
import { getLanguage } from '../../language/locale.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('search')
    .setDescription('Searches five songs from YouTube and lets you select one to play.')
    .addStringOption((option) => option.setName('query').setDescription('The query to search for.').setRequired(true)),
  async execute(interaction) {
    const { search: lang, play } = getLanguage(await interaction.client.database.getLocale(interaction.guildId))
    const channel = interaction.member.voice.channel
    if (!channel) { return await interaction.reply(errorEmbed(lang.errors.noVoiceChannel, true)) }
    if (interaction.guild.me.voice.channel && channel !== interaction.guild.me.voice.channel) { return await interaction.reply(errorEmbed(lang.errors.sameChannel, true)) }
    if (!interaction.guild.me.permissionsIn(channel).has(['CONNECT', 'SPEAK'])) { return await interaction.reply(errorEmbed(lang.errors.missingPerms, true)) }
    await interaction.deferReply()

    const player = interaction.client.lavalink.createPlayer(interaction)

    const query = interaction.options.getString('query')
    const result = await player.search(query, interaction.member)
    if (result.loadType !== 'SEARCH_RESULT') { return await interaction.editReply(errorEmbed(lang.errors.generic)) }
    const tracks = result.tracks.slice(0, 5).map((track, index) => ({ label: track.title, description: track.author, value: index.toString() }))

    // noinspection JSCheckFunctionSignatures
    const selectMenu = new MessageSelectMenu()
      .setCustomId('search')
      .setPlaceholder(lang.other.select)
      .addOptions(...tracks)

    const embedMessage = await interaction.editReply({
      embeds: [
        new MessageEmbed()
          .setAuthor({ name: lang.author, iconURL: interaction.member.user.displayAvatarURL() })
          .setTitle(lang.title(interaction.options.getString('query')))
          .setThumbnail(result.tracks[0].thumbnail)
          .setFooter({ text: `SuitBot | ${lang.other.expires}`, iconURL: interaction.client.user.displayAvatarURL() })
      ],
      components: [new MessageActionRow({ components: [selectMenu] })],
      fetchReply: true
    })

    // noinspection JSCheckFunctionSignatures
    const collector = embedMessage.createMessageComponentCollector({ time: 60000, filter: async (c) => { await c.deferUpdate(); return c.user.id === interaction.user.id } })
    collector.on('collect', async (menuInteraction) => {
      const track = result.tracks[Number(menuInteraction.values[0])]
      player.queue.add(track)
      if (player.state !== 'CONNECTED') { await player.connect() }
      if (!player.playing && !player.paused && !player.queue.length) { await player.play() }
      interaction.client.dashboard.update(player)

      // noinspection JSCheckFunctionSignatures
      await menuInteraction.editReply({
        embeds: [
          new MessageEmbed()
            .setAuthor({ name: play.author, iconURL: interaction.member.user.displayAvatarURL() })
            .setTitle(track.title)
            .setURL(track.uri)
            .setThumbnail(track.thumbnail)
            .addField(play.fields.duration.name, track.isStream ? '🔴 Live' : msToHMS(track.duration), true)
            .addField(play.fields.author.name, track.author, true)
            .addField(play.fields.position.name, (player.queue.indexOf(track) + 1).toString(), true)
            .setFooter({ text: 'SuitBot', iconURL: interaction.client.user.displayAvatarURL() })
        ],
        components: []
      })

      collector.stop()
    })
    collector.on('end', async () => {
      await embedMessage.edit({ components: [] })
    })
  }
}
