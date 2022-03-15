const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const { simpleEmbed, msToHMS } = require('../../utilities')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nowplaying')
    .setDescription('Shows the currently playing song.'),
  async execute (interaction) {
    const queue = interaction.client.player.getQueue(interaction.guild.id)
    if (!queue || !queue.playing) { return await interaction.reply(simpleEmbed('Nothing currently playing.\nStart playback with /play!', true)) }
    if (interaction.member.voice.channel !== queue.connection.channel) { return await interaction.reply(simpleEmbed('You need to be in the same voice channel as the bot to use this command!', true)) }

    const track = queue.current
    const progressBar = queue.createProgressBar({ line: '▬', indicator: '🔘' }) + `\n${msToHMS(queue.streamTime)} | ${queue.current.duration}`

    await interaction.reply({
      embeds: [new MessageEmbed()
        .setAuthor({ name: 'Now Playing...', iconURL: interaction.member.user.displayAvatarURL() })
        .setTitle(track.title)
        .setURL(track.url)
        .setThumbnail(track.thumbnail)
        .addField('Duration', track.durationMS === 0 ? '🔴 Live' : `\`${progressBar}\``, true)
        .addField('Author', track.author, true)
        .addField('Requested By', track.requestedBy.toString(), true)
        .setFooter({ text: `SuitBot | Repeat: ${{ 0: '❌', 1: '🔂 Track', 2: '🔁 Queue', 3: '⏩ Autoplay' }[queue.repeatMode]}`, iconURL: interaction.client.user.displayAvatarURL() })
      ]
    })
  }
}
