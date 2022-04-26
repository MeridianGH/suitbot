import { SlashCommandBuilder } from '@discordjs/builders'
import { MessageEmbed } from 'discord.js'
import { simpleEmbed } from '../../utilities/utilities.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('nowplaying')
    .setDescription('Shows the currently playing song.'),
  async execute(interaction) {
    const queue = interaction.client.player.getQueue(interaction.guild.id)
    if (!queue || !queue.playing) { return await interaction.reply(simpleEmbed('Nothing currently playing.\nStart playback with /play!', true)) }
    if (interaction.member.voice.channel !== queue.connection.channel) { return await interaction.reply(simpleEmbed('You need to be in the same voice channel as the bot to use this command!', true)) }

    const track = queue.nowPlaying
    const progressBar = queue.createProgressBar('▬', '🔘')

    await interaction.reply({
      embeds: [new MessageEmbed()
        .setAuthor({ name: 'Now Playing...', iconURL: interaction.member.user.displayAvatarURL() })
        .setTitle(track.title)
        .setURL(track.url)
        .setThumbnail(track.thumbnail)
        .addField('Duration', track.live ? '🔴 Live' : `\`${progressBar}\``, true)
        .addField('Author', track.author, true)
        .addField('Requested By', track.requestedBy.toString(), true)
        .setFooter({ text: `SuitBot | Repeat: ${{ 0: '❌', 1: '🔂 Track', 2: '🔁 Queue' }[queue.repeatMode]}`, iconURL: interaction.client.user.displayAvatarURL() })
      ]
    })
  }
}
