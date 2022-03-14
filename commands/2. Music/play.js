const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const { simpleEmbed, errorEmbed } = require('../../utilities')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Plays a song or playlist from YouTube.')
    .addStringOption(option => option.setName('query').setDescription('The query to search for.').setRequired(true)),
  async execute (interaction) {
    const channel = interaction.member.voice.channel
    if (!channel) { return await interaction.reply(simpleEmbed('You need to be in a voice channel to use this command.', true)) }
    if (interaction.guild.me.voice.channel && (channel !== interaction.guild.me.voice.channel)) { return await interaction.reply(simpleEmbed('You need to be in the same voice channel as the bot to use this command!', true)) }
    if (!interaction.guild.me.permissionsIn(channel).has(['CONNECT', 'SPEAK'])) return await interaction.reply(simpleEmbed('The bot does not have the correct permissions to play in your voice channel!', true))
    await interaction.deferReply()

    const queue = interaction.client.player.createQueue(interaction.guild.id, {
      initialVolume: 50,
      autoSelfDeaf: false,
      leaveOnEnd: false,
      leaveOnEmpty: false,
      leaveOnStop: true,
      volumeSmoothness: 1,
      metadata: { channel: interaction.channel }
    })

    const searchResult = await interaction.client.player.search(interaction.options.getString('query'), { requestedBy: interaction.user, searchEngine: 'playdl' })
    if (!searchResult || !searchResult.tracks.length) { return await interaction.editReply(errorEmbed('Error', 'There was an error while adding your song to the queue.')) }

    if (searchResult.playlist) {
      const playlist = searchResult.playlist
      queue.addTracks(playlist.tracks)
      if (!queue.connection) { await queue.connect(interaction.member.voice.channel) }
      if (!queue.playing) { await queue.play() }

      await interaction.editReply({
        embeds: [new MessageEmbed()
          .setAuthor({ name: 'Added to queue.', iconURL: interaction.member.user.displayAvatarURL() })
          .setTitle(playlist.title)
          .setURL(playlist.url)
          .setThumbnail(playlist.thumbnail)
          .addField('Amount', `${playlist.tracks.length} songs`, true)
          .addField('Author', playlist.author.name ?? playlist.author, true)
          .addField('Position', `${(queue.getTrackPosition(playlist.tracks[0]) + 1).toString()}-${(queue.getTrackPosition(playlist.tracks[playlist.tracks.length - 1]) + 1).toString()}`, true)
          .setFooter({ text: 'SuitBot', iconURL: interaction.client.user.displayAvatarURL() })
        ]
      })
    } else {
      const track = searchResult.tracks[0]
      queue.addTrack(track)
      if (!queue.connection) { await queue.connect(interaction.member.voice.channel) }
      if (!queue.playing) { await queue.play() }

      await interaction.editReply({
        embeds: [new MessageEmbed()
          .setAuthor({ name: 'Added to queue.', iconURL: interaction.member.user.displayAvatarURL() })
          .setTitle(track.title)
          .setURL(track.url)
          .setThumbnail(track.thumbnail)
          .addField('Duration', track.durationMS === 0 ? '🔴 Live' : track.duration, true)
          .addField('Channel', track.author, true)
          .addField('Position', (queue.getTrackPosition(track) + 1).toString(), true)
          .setFooter({ text: 'SuitBot', iconURL: interaction.client.user.displayAvatarURL() })
        ]
      })
    }
  }
}
