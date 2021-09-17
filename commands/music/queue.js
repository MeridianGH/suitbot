const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js')
const { simpleEmbed, msToHMS } = require('../../utilities')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Displays the queue.'),
  async execute (interaction) {
    const queue = interaction.client.player.getQueue(interaction.guild.id)
    if (!queue) { return await interaction.reply(simpleEmbed('Nothing currently playing.\nStart playback with /play!', true)) }

    const pages = []

    if (queue.songs.length === 1) {
      // Format single page with no upcoming songs.
      const description = `Now Playing:\n[${queue.nowPlaying.name}](${queue.nowPlaying.url}) | \`${queue.nowPlaying.duration} Requested by: ${queue.nowPlaying.requestedBy}\`\n\n`
      const embed = new MessageEmbed()
        .setTitle('Queue.')
        .setDescription(description + `No upcoming songs.\nAdd songs with /play!\n${'\u2015'.repeat(34)}`)
        .setFooter(`Page ${pages.length + 1}/${Math.ceil(queue.songs.length / 10)} | Loop: ${queue.repeatMode === 1 ? '✅' : '❌'} | Queue Loop: ${queue.repeatMode === 2 ? '✅' : '❌'}`, `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}`)
      pages.push(embed)
    } else if (queue.songs.length > 1 && queue.songs.length <= 11) {
      // Format single page.
      let description = `Now Playing:\n[${queue.nowPlaying.name}](${queue.nowPlaying.url}) | \`${queue.nowPlaying.duration} Requested by: ${queue.nowPlaying.requestedBy}\`\n\n`
      description = description + 'Up Next:\n'
      for (const song of queue.songs) {
        description = description + `\`${queue.songs.indexOf(song)}.\` [${song.name}](${song.url}) | \`${song.duration} Requested by: ${song.requestedBy}\`\n\n`
      }
      description = description + `**${queue.songs.length - 1} songs in queue | ${msToHMS(queue.songs.reduce(function (prev, cur) { return prev + cur.millisecons }, 0))} total duration**\n${'\u2015'.repeat(34)}`

      const embed = new MessageEmbed()
        .setTitle('Queue.')
        .setDescription(description)
        .setFooter(`Page ${pages.length + 1}/${Math.ceil(queue.songs.length / 10)} | Loop: ${queue.repeatMode === 1 ? '✅' : '❌'} | Queue Loop: ${queue.repeatMode === 2 ? '✅' : '❌'}`, `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}`)
      pages.push(embed)
    } else {
      // Format all pages.
      for (let i = 1; i < queue.songs.length - 1; i += 10) {
        const songs = queue.songs.slice(i, i + 10)

        let description = `Now Playing:\n[${queue.nowPlaying.name}](${queue.nowPlaying.url}) | \`${queue.nowPlaying.duration} Requested by: ${queue.nowPlaying.requestedBy}\`\n\n`
        description = description + 'Up Next:\n'
        for (const song of songs) {
          description = description + `\`${queue.songs.indexOf(song)}.\` [${song.name}](${song.url}) | \`${song.duration} Requested by: ${song.requestedBy}\`\n\n`
        }
        description = description + `**${queue.songs.length - 1} songs in queue | ${msToHMS(queue.songs.slice(1, queue.songs.length).reduce(function (prev, cur) { return prev + cur.millisecons }, 0))} total duration**\n${'\u2015'.repeat(34)}`

        const embed = new MessageEmbed()
          .setTitle('Queue.')
          .setDescription(description)
          .setFooter(`Page ${pages.length + 1}/${Math.ceil(queue.songs.length / 10)} | Loop: ${queue.repeatMode === 1 ? '✅' : '❌'} | Queue Loop: ${queue.repeatMode === 2 ? '✅' : '❌'}`, `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}`)
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
      const collector = embedMessage.createMessageComponentCollector()
      let currentIndex = 0
      collector.on('collect', async buttonInteraction => {
        // Increase/decrease index
        buttonInteraction.customId === 'previousQueue' ? (currentIndex -= 1) : (currentIndex += 1)
        // Respond to interaction by updating message with new embed
        if (currentIndex === 0) {
          await buttonInteraction.update({ embeds: [pages[currentIndex]], components: [new MessageActionRow({ components: [previous.setDisabled(true), next.setDisabled(false)] })] })
        } else if (currentIndex === pages.length - 1) {
          await buttonInteraction.update({ embeds: [pages[currentIndex]], components: [new MessageActionRow({ components: [previous.setDisabled(false), next.setDisabled(true)] })] })
        } else {
          await buttonInteraction.update({ embeds: [pages[currentIndex]], components: [new MessageActionRow({ components: [previous.setDisabled(false), next.setDisabled(false)] })] })
        }
      })
    }
  }
}
