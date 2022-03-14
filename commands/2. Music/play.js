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

    const query = interaction.options.getString('query')
    if (query.match(/^https?:\/\/(?:open|play)\.spotify\.com\/playlist\/.+$/i) ||
      query.match(/^https?:\/\/(?:www\.)?youtube\.com\/playlist\?list=.+$/i)) {
      await this._playPlaylist(interaction)
    } else {
      await this._playSong(interaction)
    }
  },

  async _playSong (interaction) {
    const queue = interaction.client.player.createQueue(interaction.guild.id)
    queue.setData({ channel: interaction.channel })

    await queue.join(interaction.member.voice.channel)
    const song = await queue.play(interaction.options.getString('query'), { requestedBy: interaction.member.displayName }).catch(() => { if (!queue) { queue.stop() } })
    if (!song) { return await interaction.editReply(errorEmbed('Error', 'There was an error while adding your song to the queue.')) }

    await interaction.editReply({
      embeds: [new MessageEmbed()
        .setAuthor({ name: 'Added to queue.', iconURL: interaction.member.user.displayAvatarURL() })
        .setTitle(song.name)
        .setURL(song.url)
        .setThumbnail(song.thumbnail)
        .addField('Channel', song.author, true)
        .addField('Duration', song.duration, true)
        .addField('Position', queue.songs.indexOf(song).toString(), true)
        .setFooter({ text: 'SuitBot', iconURL: interaction.client.user.displayAvatarURL() })
      ]
    })
  },

  async _playPlaylist (interaction) {
    const queue = interaction.client.player.createQueue(interaction.guild.id)
    queue.setData({ channel: interaction.channel })

    await queue.join(interaction.member.voice.channel)
    const playlist = await queue.playlist(interaction.options.getString('query'), { requestedBy: interaction.member.displayName }).catch(() => { if (!queue) { queue.stop() } })
    if (!playlist) { return await interaction.editReply(errorEmbed('Error', 'There was an error while adding your playlist to the queue.')) }

    await interaction.editReply({
      embeds: [new MessageEmbed()
        .setAuthor({ name: 'Added to queue.', iconURL: interaction.member.user.displayAvatarURL() })
        .setTitle(playlist.name)
        .setURL(playlist.url)
        .setThumbnail(playlist.songs[0].thumbnail)
        .addField('Author', playlist.author.name ?? playlist.author, true)
        .addField('Amount', `${playlist.songs.length} songs`, true)
        .addField('Position', `${queue.songs.indexOf(playlist.songs[0]).toString()}-${queue.songs.indexOf(playlist.songs[playlist.songs.length - 1]).toString()}`, true)
        .setFooter({ text: 'SuitBot', iconURL: interaction.client.user.displayAvatarURL() })
      ]
    })
  }
}
