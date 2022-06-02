import { SlashCommandBuilder } from '@discordjs/builders'
import { MessageEmbed } from 'discord.js'
import { errorEmbed, msToHMS } from '../../utilities/utilities.js'
import { getLanguage } from '../../language/locale.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('nowplaying')
    .setDescription('Shows the currently playing song.'),
  async execute(interaction) {
    const lang = getLanguage(await interaction.client.database.getLocale(interaction.guildId)).nowplaying
    const player = interaction.client.lavalink.getPlayer(interaction.guild.id)
    if (!player || !player.current) { return await interaction.reply(errorEmbed(lang.errors.nothingPlaying, true)) }
    if (interaction.member.voice.channel.id !== player.voiceChannel) { return await interaction.reply(errorEmbed(lang.errors.sameChannel, true)) }

    const track = player.queue.current

    const progress = Math.round(20 * player.position / player.queue.current.duration)
    const progressBar = '▬'.repeat(progress) + '🔘' + ' '.repeat(20 - progress) + '\n' + msToHMS(player.position) + '/' + msToHMS(player.queue.current.duration)

    await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setAuthor({ name: lang.author, iconURL: interaction.member.user.displayAvatarURL() })
          .setTitle(track.title)
          .setURL(track.uri)
          .setThumbnail(track.thumbnail)
          .addField(lang.fields.duration.name, track.isStream ? '🔴 Live' : `\`${progressBar}\``, true)
          .addField(lang.fields.author.name, track.author, true)
          .addField(lang.fields.requestedBy.name, track.requester.toString(), true)
          .setFooter({ text: `SuitBot | ${lang.other.repeatModes.repeat}: ${player.queueRepeat ? '🔁 ' + lang.other.repeatModes.queue : player.trackRepeat ? '🔂 ' + lang.other.repeatModes.track : '❌'}`, iconURL: interaction.client.user.displayAvatarURL() })
      ]
    })
  }
}
