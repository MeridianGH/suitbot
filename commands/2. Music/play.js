import { SlashCommandBuilder } from '@discordjs/builders'
import { MessageEmbed } from 'discord.js'
import { errorEmbed, msToHMS } from '../../utilities/utilities.js'
import { getLanguage } from '../../language/locale.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Plays a song or playlist from YouTube.')
    .addStringOption((option) => option.setName('query').setDescription('The query to search for.').setRequired(true)),
  async execute(interaction) {
    const lang = getLanguage(await interaction.client.database.getLocale(interaction.guildId)).play
    const channel = interaction.member.voice.channel
    if (!channel) { return await interaction.reply(errorEmbed(lang.errors.noVoiceChannel, true)) }
    if (interaction.guild.me.voice.channel && channel !== interaction.guild.me.voice.channel) { return await interaction.reply(errorEmbed(lang.errors.sameChannel, true)) }
    if (!interaction.guild.me.permissionsIn(channel).has(['CONNECT', 'SPEAK'])) { return await interaction.reply(errorEmbed(lang.errors.missingPerms, true)) }
    await interaction.deferReply()

    const player = interaction.client.lavalink.createPlayer(interaction)

    const query = interaction.options.getString('query')
    const result = await player.search(query, interaction.member)
    if (result.loadType === 'LOAD_FAILED' || result.loadType === 'NO_MATCHES') { return await interaction.editReply(errorEmbed(lang.errors.generic)) }

    if (result.loadType === 'PLAYLIST_LOADED') {
      player.queue.add(result.tracks)
      if (player.state !== 'CONNECTED') { await player.connect() }
      if (!player.playing && !player.paused && player.queue.totalSize === result.tracks.length) { await player.play() }
      interaction.client.dashboard.update(player)

      // noinspection JSUnresolvedVariable
      const embed = new MessageEmbed()
        .setAuthor({ name: lang.author, iconURL: interaction.member.user.displayAvatarURL() })
        .setTitle(result.playlist.name)
        .setURL(result.playlist.uri)
        .setThumbnail(result.playlist.thumbnail)
        .addField(lang.fields.amount.name, lang.fields.amount.value(result.tracks.length), true)
        .addField(lang.fields.author.name, result.playlist.author, true)
        .addField(lang.fields.position.name, `${player.queue.indexOf(result.tracks[0]) + 1}-${player.queue.indexOf(result.tracks[result.tracks.length - 1]) + 1}`, true)
        .setFooter({ text: 'SuitBot', iconURL: interaction.client.user.displayAvatarURL() })
      await interaction.editReply({ embeds: [embed] })
    } else {
      const track = result.tracks[0]
      player.queue.add(track)
      if (player.state !== 'CONNECTED') { await player.connect() }
      if (!player.playing && !player.paused && !player.queue.length) { await player.play() }
      interaction.client.dashboard.update(player)

      const embed = new MessageEmbed()
        .setAuthor({ name: lang.author, iconURL: interaction.member.user.displayAvatarURL() })
        .setTitle(track.title)
        .setURL(track.uri)
        .setThumbnail(track.thumbnail)
        .addField(lang.fields.duration.name, track.isStream ? '🔴 Live' : msToHMS(track.duration), true)
        .addField(lang.fields.author.name, track.author, true)
        .addField(lang.fields.position.name, (player.queue.indexOf(track) + 1).toString(), true)
        .setFooter({ text: 'SuitBot', iconURL: interaction.client.user.displayAvatarURL() })
      await interaction.editReply({ embeds: [embed] })
    }
  }
}
