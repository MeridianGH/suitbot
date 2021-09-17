const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const { simpleEmbed } = require('../../utilities')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nowplaying')
    .setDescription('Shows the currently playing song.'),
  async execute (interaction) {
    const queue = interaction.client.player.getQueue(interaction.guild.id)
    if (!queue) { return await interaction.reply(simpleEmbed('Nothing currently playing.\nStart playback with /play!', true)) }
    const song = queue.nowPlaying
    const progressBar = queue.createProgressBar({ block: '▬', arrow: '🔘' }).prettier

    await interaction.reply({
      embeds: [new MessageEmbed()
        .setAuthor('Now Playing...', `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}`)
        .setTitle(song.name)
        .setURL(song.url)
        .setThumbnail(song.thumbnail)
        .setFields(
          { name: 'Channel', value: song.author, inline: true },
          { name: 'Duration', value: `\`${progressBar}\``, inline: true }
        )
        .setFooter(`Loop: ${queue.repeatMode === 1 ? '✅' : '❌'} | Queue Loop: ${queue.repeatMode === 2 ? '✅' : '❌'}`, 'https://cdn.discordapp.com/app-icons/887122733010411611/78c68033a9da502750c5165029b57817.png')
      ]
    })
  }
}
