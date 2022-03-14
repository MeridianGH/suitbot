const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const { simpleEmbed } = require('../../utilities')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nowplaying')
    .setDescription('Shows the currently playing song.'),
  async execute (interaction) {
    const queue = interaction.client.player.getQueue(interaction.guild.id)
    if (!queue || !queue.nowPlaying) { return await interaction.reply(simpleEmbed('Nothing currently playing.\nStart playback with /play!', true)) }
    if (interaction.member.voice.channel !== queue.connection.channel) { return await interaction.reply(simpleEmbed('You need to be in the same voice channel as the bot to use this command!', true)) }

    const song = queue.nowPlaying
    const progressBar = queue.createProgressBar({ block: '▬', arrow: '🔘' }).prettier

    await interaction.reply({
      embeds: [new MessageEmbed()
        .setAuthor({ name: 'Now Playing...', iconURL: interaction.member.user.displayAvatarURL() })
        .setTitle(song.name)
        .setURL(song.url)
        .setThumbnail(song.thumbnail)
        .addField('Channel', song.author, true)
        .addField('Duration', `\`${progressBar}\``, true)
        .setFooter({ text: `SuitBot | Loop: ${queue.repeatMode === 1 ? '✅' : '❌'} | Queue Loop: ${queue.repeatMode === 2 ? '✅' : '❌'}`, iconURL: interaction.client.user.displayAvatarURL() })
      ]
    })
  }
}
