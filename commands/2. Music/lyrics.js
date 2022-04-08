import { SlashCommandBuilder } from '@discordjs/builders'
import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js'
import { simpleEmbed } from '../../utilities.js'
import playdl from 'play-dl'
import { geniusAppId } from '../../config.js'
import genius from 'genius-lyrics'
const Genius = new genius.Client(geniusAppId)

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('lyrics')
    .setDescription('Shows the lyrics of the currently playing song.'),
  async execute (interaction) {
    const queue = interaction.client.player.getQueue(interaction.guild.id)
    if (!queue || !queue.playing) { return await interaction.reply(simpleEmbed('Nothing currently playing.\nStart playback with /play!', true)) }
    if (interaction.member.voice.channel !== queue.connection.channel) { return await interaction.reply(simpleEmbed('You need to be in the same voice channel as the bot to use this command!', true)) }
    await interaction.deferReply()

    const musicInfo = (await playdl.video_basic_info(queue.nowPlaying.streamURL, { language: 'en-US' })).video_details.music
    const title = musicInfo ? musicInfo[0].artist + ' ' + musicInfo[0].song : queue.nowPlaying.title

    try {
      const song = (await Genius.songs.search(title))[0]
      const lyrics = await song.lyrics()

      const lines = lyrics.split('\n')
      const pages = ['']
      let index = 0
      for (let i = 0; i < lines.length; i++) {
        if (pages[index].length + lines[i].length > 4096) {
          index++
          pages[index] = ''
        }
        pages[index] += '\n' + lines[i]
      }

      const isOnePage = pages.length === 1

      const previous = new MessageButton()
        .setCustomId('previous')
        .setLabel('Previous')
        .setStyle('PRIMARY')
      const next = new MessageButton()
        .setCustomId('next')
        .setLabel('Next')
        .setStyle('PRIMARY')

      const embedMessage = await interaction.editReply({
        embeds: [new MessageEmbed()
          .setAuthor({ name: 'Lyrics', iconURL: interaction.member.user.displayAvatarURL() })
          .setTitle(queue.nowPlaying.title)
          .setURL(song.url)
          .setThumbnail(queue.nowPlaying.thumbnail)
          .setDescription(pages[0])
          .setFooter({
            text: `SuitBot | Repeat: ${{ 0: '❌', 1: '🔂 Track', 2: '🔁 Queue' }[queue.repeatMode]} | Provided by genius.com`,
            iconURL: interaction.client.user.displayAvatarURL()
          })],
        components: isOnePage ? [] : [new MessageActionRow({ components: [previous.setDisabled(true), next.setDisabled(false)] })],
        fetchReply: true
      })

      if (!isOnePage) {
        // Collect button interactions (when a user clicks a button),
        const collector = embedMessage.createMessageComponentCollector({ idle: 150000 })
        let currentIndex = 0
        collector.on('collect', async buttonInteraction => {
          buttonInteraction.customId === 'previous' ? (currentIndex -= 1) : (currentIndex += 1)
          await buttonInteraction.update({
            embeds: [new MessageEmbed()
              .setAuthor({ name: 'Lyrics', iconURL: interaction.member.user.displayAvatarURL() })
              .setTitle(queue.nowPlaying.title)
              .setURL(song.url)
              .setThumbnail(queue.nowPlaying.thumbnail)
              .setDescription(pages[currentIndex])
              .setFooter({
                text: `SuitBot | Repeat: ${{ 0: '❌', 1: '🔂 Track', 2: '🔁 Queue' }[queue.repeatMode]} | Provided by genius.com`,
                iconURL: interaction.client.user.displayAvatarURL()
              })],
            components: [new MessageActionRow({ components: [previous.setDisabled(currentIndex === 0), next.setDisabled(currentIndex === pages.length - 1)] })]
          })
        })
        collector.on('end', async () => {
          await embedMessage.edit({ components: [new MessageActionRow({ components: [previous.setDisabled(true), next.setDisabled(true)] })] })
        })
      }
    } catch {
      await interaction.editReply({
        embeds: [new MessageEmbed()
          .setAuthor({ name: 'Lyrics', iconURL: interaction.member.user.displayAvatarURL() })
          .setTitle(queue.nowPlaying.title)
          .setURL(queue.nowPlaying.url)
          .setThumbnail(queue.nowPlaying.thumbnail)
          .setDescription('No results found!')
          .setFooter({ text: `SuitBot | Repeat: ${{ 0: '❌', 1: '🔂 Track', 2: '🔁 Queue' }[queue.repeatMode]} | Provided by genius.com`, iconURL: interaction.client.user.displayAvatarURL() })]
      })
    }
  }
}