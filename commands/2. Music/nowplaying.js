import { SlashCommandBuilder } from '@discordjs/builders'
import { MessageEmbed } from 'discord.js'
import { simpleEmbed } from '../../utilities/utilities.js'
import locale from '../../language/locale.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('nowplaying')
    .setDescription('Shows the currently playing song.'),
  async execute(interaction) {
    const { nowplaying: lang } = locale[await interaction.client.database.getLocale(interaction.guildId)]
    const queue = interaction.client.player.getQueue(interaction.guild.id)
    if (!queue || !queue.playing) { return await interaction.reply(simpleEmbed(lang.errors.nothingPlaying, true)) }
    if (interaction.member.voice.channel !== queue.connection.channel) { return await interaction.reply(simpleEmbed(lang.errors.sameChannel, true)) }

    const track = queue.nowPlaying
    const progressBar = queue.createProgressBar('▬', '🔘')

    await interaction.reply({
      embeds: [new MessageEmbed()
        .setAuthor({ name: lang.author, iconURL: interaction.member.user.displayAvatarURL() })
        .setTitle(track.title)
        .setURL(track.url)
        .setThumbnail(track.thumbnail)
        .addField(lang.fields.duration.name, track.live ? '🔴 Live' : `\`${progressBar}\``, true)
        .addField(lang.fields.author.name, track.author, true)
        .addField(lang.fields.requestedBy.name, track.requestedBy.toString(), true)
        .setFooter({ text: `SuitBot | ${lang.other.repeatModes.repeat}: ${{ 0: '❌', 1: '🔂 ' + lang.other.repeatModes.track, 2: '🔁 ' + lang.other.repeatModes.queue }[queue.repeatMode]}`, iconURL: interaction.client.user.displayAvatarURL() })
      ]
    })
  }
}
