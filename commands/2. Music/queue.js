const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js')
const { simpleEmbed, msToHMS } = require('../../utilities')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Displays the queue.'),
  async execute (interaction) {
    const queue = interaction.client.player.getQueue(interaction.guild.id)
    if (!queue || !queue.playing) { return await interaction.reply(simpleEmbed('Nothing currently playing.\nStart playback with /play!', true)) }
    if (interaction.member.voice.channel !== queue.connection.channel) { return await interaction.reply(simpleEmbed('You need to be in the same voice channel as the bot to use this command!', true)) }

    const pages = []

    if (queue.tracks.length === 0) {
      // Format single page with no upcoming songs.
      let description = 'Still using old and boring commands? Use the new [web dashboard](https://suitbot.xyz) instead!\n\n'
      description += `Now Playing:\n[${queue.current.title}](${queue.current.url}) | \`${queue.current.durationMS === 0 ? '🔴 Live' : queue.current.duration}\`\n\n`
      description += `No upcoming songs.\nAdd songs with /play!\n${'\u2015'.repeat(34)}`

      const embed = new MessageEmbed()
        .setAuthor({ name: 'Queue.', iconURL: interaction.member.user.displayAvatarURL() })
        .setDescription(description)
        .setFooter({ text: `SuitBot | Page 1/1 | Repeat: ${{ 0: '❌', 1: '🔂 Track', 2: '🔁 Queue', 3: '⏩ Autoplay' }[queue.repeatMode]}`, iconURL: interaction.client.user.displayAvatarURL() })
      pages.push(embed)
    } else if (queue.tracks.length >= 1 && queue.tracks.length <= 10) {
      // Format single page.
      let description = 'Still using old and boring commands? Use the new [web dashboard](https://suitbot.xyz) instead!\n\n'
      description += `Now Playing:\n[${queue.current.title}](${queue.current.url}) | \`${queue.current.durationMS === 0 ? '🔴 Live' : queue.current.duration}\`\n\n`
      for (const track of queue.tracks) { description += `\`${(queue.getTrackPosition(track) + 1)}.\` [${track.title}](${track.url}) | \`${track.durationMS === 0 ? '🔴 Live' : track.duration}\`\n\n` }
      description += `**${queue.tracks.length} songs in queue | ${msToHMS(queue.totalTime)} total duration**\n${'\u2015'.repeat(34)}`

      const embed = new MessageEmbed()
        .setAuthor({ name: 'Queue.', iconURL: interaction.member.user.displayAvatarURL() })
        .setDescription(description)
        .setFooter({ text: `SuitBot | Page 1/1 | Repeat: ${{ 0: '❌', 1: '🔂 Track', 2: '🔁 Queue', 3: '⏩ Autoplay' }[queue.repeatMode]}`, iconURL: interaction.client.user.displayAvatarURL() })
      pages.push(embed)
    } else {
      // Format all pages.
      for (let i = 0; i < queue.tracks.length; i += 10) {
        const tracks = queue.tracks.slice(i, i + 10)

        let description = 'Still using old and boring commands? Use the new [web dashboard](https://suitbot.xyz) instead!\n\n'
        description += `Now Playing:\n[${queue.current.title}](${queue.current.url}) | \`${queue.current.durationMS === 0 ? '🔴 Live' : queue.current.duration}\`\n\n`
        for (const track of tracks) { description += `\`${(queue.getTrackPosition(track) + 1)}.\` [${track.title}](${track.url}) | \`${track.durationMS === 0 ? '🔴 Live' : track.duration}\`\n\n` }
        description += `**${queue.tracks.length} songs in queue | ${msToHMS(queue.totalTime)} total duration**\n${'\u2015'.repeat(34)}`

        const embed = new MessageEmbed()
          .setAuthor({ name: 'Queue.', iconURL: interaction.member.user.displayAvatarURL() })
          .setDescription(description)
          .setFooter({ text: `SuitBot | Page ${pages.length + 1}/${Math.ceil(queue.tracks.length / 10)} | Repeat: ${{ 0: '❌', 1: '🔂 Track', 2: '🔁 Queue', 3: '⏩ Autoplay' }[queue.repeatMode]}`, iconURL: interaction.client.user.displayAvatarURL() })
        pages.push(embed)
      }
    }

    const isOnePage = pages.length === 1

    const previous = new MessageButton()
      .setCustomId('previousQueue')
      .setLabel('Previous')
      .setStyle('PRIMARY')
    const next = new MessageButton()
      .setCustomId('nextQueue')
      .setLabel('Next')
      .setStyle('PRIMARY')

    const embedMessage = await interaction.reply({ embeds: [pages[0]], components: isOnePage ? [] : [new MessageActionRow({ components: [previous.setDisabled(true), next.setDisabled(false)] })], fetchReply: true })

    if (!isOnePage) {
      // Collect button interactions (when a user clicks a button),
      const collector = embedMessage.createMessageComponentCollector({ idle: 150000 })
      let currentIndex = 0
      collector.on('collect', async buttonInteraction => {
        buttonInteraction.customId === 'previousQueue' ? (currentIndex -= 1) : (currentIndex += 1)
        await buttonInteraction.update({ embeds: [pages[currentIndex]], components: [new MessageActionRow({ components: [previous.setDisabled(currentIndex === 0), next.setDisabled(currentIndex === pages.length - 1)] })] })
      })
      collector.on('end', async () => {
        await embedMessage.edit({ components: [new MessageActionRow({ components: [previous.setDisabled(true), next.setDisabled(true)] })] })
      })
    }
  }
}
