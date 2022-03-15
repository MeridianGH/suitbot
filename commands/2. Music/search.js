const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js')
const { simpleEmbed, errorEmbed } = require('../../utilities')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('search')
    .setDescription('Searches five songs from YouTube and lets you select one to play.')
    .addStringOption(option => option.setName('query').setDescription('The query to search for.').setRequired(true)),
  async execute (interaction) {
    const channel = interaction.member.voice.channel
    if (!channel) { return await interaction.reply(simpleEmbed('You need to be in a voice channel to use this command.', true)) }
    if (interaction.guild.me.voice.channel && (channel !== interaction.guild.me.voice.channel)) { return await interaction.reply(simpleEmbed('You need to be in the same voice channel as the bot to use this command!', true)) }
    if (!interaction.guild.me.permissionsIn(channel).has(['CONNECT', 'SPEAK'])) return await interaction.reply(simpleEmbed('The bot does not have the correct permissions to play in your voice channel!', true))
    await interaction.deferReply()

    const searchResult = await interaction.client.player.search(interaction.options.getString('query'), { requestedBy: interaction.user, searchEngine: 'playdl' })
    if (!searchResult || !searchResult.tracks.length) { return await interaction.editReply(errorEmbed('Error', 'There was an error while searching for your query.')) }
    if (searchResult.playlist) { return await interaction.editReply(simpleEmbed('This command doesn\'t support playlists.\nUse "`/play`" instead.', true)) }
    const tracks = searchResult.tracks

    // noinspection JSCheckFunctionSignatures
    const selectMenu = new MessageSelectMenu()
      .setCustomId('search')
      .setPlaceholder('Select a song...')
      .addOptions([
        { label: tracks[0].title, description: tracks[0].author, value: '0' },
        { label: tracks[1].title, description: tracks[1].author, value: '1' },
        { label: tracks[2].title, description: tracks[2].author, value: '2' },
        { label: tracks[3].title, description: tracks[3].author, value: '3' },
        { label: tracks[4].title, description: tracks[4].author, value: '4' }
      ])

    const embedMessage = await interaction.editReply({
      embeds: [new MessageEmbed()
        .setAuthor({ name: 'Search Results.', iconURL: interaction.member.user.displayAvatarURL() })
        .setTitle(`Here are the search results for your search\n"\`${interaction.options.getString('query')}\`":`)
        .setThumbnail(tracks[0].thumbnail)
        .setFooter({ text: 'SuitBot | This embed expires after one minute.', iconURL: interaction.client.user.displayAvatarURL() })
      ],
      components: [new MessageActionRow({ components: [selectMenu] })],
      fetchReply: true
    })

    // noinspection JSCheckFunctionSignatures
    const collector = embedMessage.createMessageComponentCollector({ time: 60000, filter: async c => { await c.deferUpdate(); return c.user.id === interaction.user.id } })
    collector.on('collect', async menuInteraction => {
      const queue = interaction.client.player.createQueue(interaction.guild.id, {
        initialVolume: 50,
        autoSelfDeaf: false,
        leaveOnEnd: false,
        leaveOnEmpty: false,
        leaveOnStop: true,
        volumeSmoothness: 1,
        metadata: { channel: interaction.channel }
      })

      const track = tracks[Number(menuInteraction.values[0])]
      queue.addTrack(track)
      if (!queue.connection) { await queue.connect(interaction.member.voice.channel) }
      if (!queue.playing) { await queue.play() }

      // noinspection JSCheckFunctionSignatures
      await menuInteraction.editReply({
        embeds: [new MessageEmbed()
          .setAuthor({ name: 'Added to queue.', iconURL: interaction.member.user.displayAvatarURL() })
          .setTitle(track.title)
          .setURL(track.url)
          .setThumbnail(track.thumbnail)
          .addField('Duration', track.durationMS === 0 ? '🔴 Live' : track.duration, true)
          .addField('Author', track.author, true)
          .addField('Position', (queue.getTrackPosition(track) + 1).toString(), true)
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
