const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js')
const { simpleEmbed, msToHMS } = require('../../utilities')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Displays the queue.'),
  async execute (interaction) {
    const queue = interaction.client.player.getQueue(interaction.guild.id)
    if (!queue || !queue.nowPlaying) { return await interaction.reply(simpleEmbed('Nothing currently playing.\nStart playback with /play!', true)) }
    if (interaction.member.voice.channel !== queue.connection.channel) { return await interaction.reply(simpleEmbed('You need to be in the same voice channel as the bot to use this command!', true)) }

    const pages = []

    if (queue.songs.length === 1) {
      // Format single page with no upcoming songs.
      let description = ''
      description += 'Still using old and boring commands? Use the new [web dashboard](https://suitbot.xyz) instead!\n\n'
      description += `Now Playing:\n[${queue.nowPlaying.name}](${queue.nowPlaying.url}) | \`${queue.nowPlaying.duration} Requested by: ${queue.nowPlaying.requestedBy}\`\n\n`
      const embed = new MessageEmbed()
        .setAuthor({ name: 'Queue.', iconURL: interaction.member.user.displayAvatarURL() })
        .setDescription(description + `No upcoming songs.\nAdd songs with /play!\n${'\u2015'.repeat(34)}`)
        .setFooter({ text: `SuitBot | Page 1/1 | Loop: ${queue.repeatMode === 1 ? '✅' : '❌'} | Queue Loop: ${queue.repeatMode === 2 ? '✅' : '❌'}`, iconURL: interaction.client.user.displayAvatarURL() })
      pages.push(embed)
    } else if (queue.songs.length > 1 && queue.songs.length <= 11) {
      // Format single page.
      let description = ''
      description += 'Still using old and boring commands? Use the new [web dashboard](https://suitbot.xyz) instead!\n\n'
      description += `Now Playing:\n[${queue.nowPlaying.name}](${queue.nowPlaying.url}) | \`${queue.nowPlaying.duration} Requested by: ${queue.nowPlaying.requestedBy}\`\n\nUp Next:\n`
      for (const song of queue.songs.slice(1)) {
        description += `\`${queue.songs.indexOf(song)}.\` [${song.name}](${song.url}) | \`${song.duration} Requested by: ${song.requestedBy}\`\n\n`
      }
      description += `**${queue.songs.length - 1} songs in queue | ${msToHMS(queue.songs.reduce(function (prev, cur) { return prev + cur.milliseconds }, 0))} total duration**\n${'\u2015'.repeat(34)}`

      const embed = new MessageEmbed()
        .setAuthor({ name: 'Queue.', iconURL: interaction.member.user.displayAvatarURL() })
        .setDescription(description)
        .setFooter({ text: `SuitBot | Page 1/1 | Loop: ${queue.repeatMode === 1 ? '✅' : '❌'} | Queue Loop: ${queue.repeatMode === 2 ? '✅' : '❌'}`, iconURL: interaction.client.user.displayAvatarURL() })
      pages.push(embed)
    } else {
      // Format all pages.
      for (let i = 1; i < queue.songs.length - 1; i += 10) {
        const songs = queue.songs.slice(i, i + 10)

        let description = ''
        description += 'Still using old and boring commands? Use the new [web dashboard](https://suitbot.xyz) instead!\n\n'
        description += `Now Playing:\n[${queue.nowPlaying.name}](${queue.nowPlaying.url}) | \`${queue.nowPlaying.duration} Requested by: ${queue.nowPlaying.requestedBy}\`\n\nUp Next:\n`
        for (const song of songs) {
          description += `\`${queue.songs.indexOf(song)}.\` [${song.name}](${song.url}) | \`${song.duration} Requested by: ${song.requestedBy}\`\n\n`
        }
        description += `**${queue.songs.length - 1} songs in queue | ${msToHMS(queue.songs.slice(1, queue.songs.length).reduce(function (prev, cur) { return prev + cur.milliseconds }, 0))} total duration**\n${'\u2015'.repeat(34)}`

        const embed = new MessageEmbed()
          .setAuthor({ name: 'Queue.', iconURL: interaction.member.user.displayAvatarURL() })
          .setDescription(description)
          .setFooter({ text: `SuitBot | Page ${pages.length + 1}/${Math.ceil(queue.songs.length / 10)} | Loop: ${queue.repeatMode === 1 ? '✅' : '❌'} | Queue Loop: ${queue.repeatMode === 2 ? '✅' : '❌'}`, iconURL: interaction.client.user.displayAvatarURL() })
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
