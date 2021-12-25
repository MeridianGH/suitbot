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
    if (!channel) { return interaction.reply(simpleEmbed('You need to be in a voice channel to use this command.', true)) }
    const permissions = channel.permissionsFor(interaction.client.user)
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) return interaction.reply(simpleEmbed('I do not have the correct permissions to play in your voice channel!', true))
    await interaction.deferReply()

    const query = interaction.options.getString('query')
    if (query.match(/^https?:\/\/(?:open|play)\.spotify\.com\/playlist\/.+$/i) ||
      query.match(/^https?:\/\/(?:www\.)?youtube\.com\/playlist\?list=.+$/i)) {
      await this._playPlaylist(interaction)
    } else {
      await this._playSong(interaction)
    }
  },

  async _playSong (interaction) {
    const guildQueue = interaction.client.player.getQueue(interaction.guild.id)
    const queue = interaction.client.player.createQueue(interaction.guild.id)
    queue.setData({ channel: interaction.channel })

    await queue.join(interaction.member.voice.channel)
    const song = await queue.play(interaction.options.getString('query'),{ requestedBy: interaction.member.displayName }).catch(() => { if (!guildQueue) { queue.stop() } })
    if (!song) { return await interaction.editReply(errorEmbed('Error', 'There was an error while adding your song to the queue.')) }

    await interaction.editReply({
      embeds: [new MessageEmbed()
        .setAuthor('Added to queue.', interaction.member.user.displayAvatarURL())
        .setTitle(song.name)
        .setURL(song.url)
        .setThumbnail(song.thumbnail)
        .addField('Channel', song.author, true)
        .addField('Duration', song.duration, true)
        .addField('Position', queue.songs.indexOf(song).toString(), true)
        .setFooter('SuitBot', interaction.client.user.displayAvatarURL())
      ]
    })
  },

  async _playPlaylist (interaction) {
    const guildQueue = interaction.client.player.getQueue(interaction.guild.id)
    const queue = interaction.client.player.createQueue(interaction.guild.id)
    queue.setData({ channel: interaction.channel })

    await queue.join(interaction.member.voice.channel)
    const playlist = await queue.playlist(interaction.options.getString('query'), { requestedBy: interaction.member.displayName }).catch(() => { if (!guildQueue) { queue.stop() } })
    if (!playlist) { return await interaction.editReply(errorEmbed('Error', 'There was an error while adding your playlist to the queue.')) }

    await interaction.editReply({
      embeds: [new MessageEmbed()
        .setAuthor('Added to queue.', interaction.member.user.displayAvatarURL())
        .setTitle(playlist.name)
        .setURL(playlist.url)
        .setThumbnail(playlist.songs[0].thumbnail)
        .addField('Author', playlist.author.name ?? playlist.author, true)
        .addField('Amount', `${playlist.songs.length} songs`, true)
        .addField('Position', `${queue.songs.indexOf(playlist.songs[0]).toString()}-${queue.songs.indexOf(playlist.songs[playlist.songs.length - 1]).toString()}`, true)
        .setFooter('SuitBot', interaction.client.user.displayAvatarURL())
      ]
    })
  }
}
