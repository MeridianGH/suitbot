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
        .setAuthor('Now Playing...', interaction.member.user.displayAvatarURL())
        .setTitle(song.name)
        .setURL(song.url)
        .setThumbnail(song.thumbnail)
        .setFields(
          { name: 'Channel', value: song.author, inline: true },
          { name: 'Duration', value: `\`${progressBar}\``, inline: true }
        )
        .setFooter(`SuitBot | Loop: ${queue.repeatMode === 1 ? '✅' : '❌'} | Queue Loop: ${queue.repeatMode === 2 ? '✅' : '❌'}`, interaction.client.user.displayAvatarURL())
      ]
    })
  }
}
