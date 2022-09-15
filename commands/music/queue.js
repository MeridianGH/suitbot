import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { errorEmbed, msToHMS } from '../../utilities/utilities.js'
import { getLanguage } from '../../language/locale.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Displays the queue.'),
  async execute(interaction) {
    const lang = getLanguage(await interaction.client.database.getLocale(interaction.guildId)).queue
    const player = interaction.client.lavalink.getPlayer(interaction.guild.id)
    if (!player || !player.queue.current) { return await interaction.reply(errorEmbed(lang.errors.nothingPlaying, true)) }
    if (interaction.member.voice.channel.id !== player.voiceChannel) { return await interaction.reply(errorEmbed(lang.errors.sameChannel, true)) }

    const queue = player.queue
    const pages = []

    if (queue.length === 0) {
      // Format single page with no upcoming songs.
      let description = lang.other.dashboard + '\n\n'
      description += `${lang.other.nowPlaying}\n[${queue.current.title}](${queue.current.uri}) | \`${queue.current.isStream ? '🔴 Live' : msToHMS(queue.current.duration)}\`\n\n`
      description += lang.other.noUpcomingSongs + '\u2015'.repeat(34)

      const embed = new EmbedBuilder()
        .setAuthor({ name: lang.author, iconURL: interaction.member.user.displayAvatarURL() })
        .setDescription(description)
        .setFooter({ text: `SuitBot | ${lang.other.page} 1/1 | ${lang.other.repeatModes.repeat}: ${player.queueRepeat ? '🔁 ' + lang.other.repeatModes.queue : player.trackRepeat ? '🔂 ' + lang.other.repeatModes.track : '❌'}`, iconURL: interaction.client.user.displayAvatarURL() })
      pages.push(embed)
    } else if (queue.length > 0 && queue.length <= 10) {
      // Format single page.
      let description = lang.other.dashboard + '\n\n'
      description += `${lang.other.nowPlaying}\n[${queue.current.title}](${queue.current.uri}) | \`${queue.current.isStream ? '🔴 Live' : msToHMS(queue.current.duration)}\`\n\n`
      for (const track of queue) { description += `\`${queue.indexOf(track) + 1}.\` [${track.title}](${track.uri}) | \`${track.isStream ? '🔴 Live' : msToHMS(track.duration)}\`\n\n` }
      description += `**${lang.other.songsInQueue(queue.length)} | ${lang.other.totalDuration(msToHMS(queue.duration))}**\n${'\u2015'.repeat(34)}`

      const embed = new EmbedBuilder()
        .setAuthor({ name: lang.author, iconURL: interaction.member.user.displayAvatarURL() })
        .setDescription(description)
        .setFooter({ text: `SuitBot | ${lang.other.page} 1/1 | ${lang.other.repeatModes.repeat}: ${player.queueRepeat ? '🔁 ' + lang.other.repeatModes.queue : player.trackRepeat ? '🔂 ' + lang.other.repeatModes.track : '❌'}`, iconURL: interaction.client.user.displayAvatarURL() })
      pages.push(embed)
    } else {
      // Format all pages.
      for (let i = 0; i < queue.length; i += 10) {
        const tracks = queue.slice(i, i + 10)

        let description = lang.other.dashboard + '\n\n'
        description += `${lang.other.nowPlaying}\n[${queue.current.title}](${queue.current.uri}) | \`${queue.current.isStream ? '🔴 Live' : msToHMS(queue.current.duration)}\`\n\n`
        for (const track of tracks) { description += `\`${queue.indexOf(track) + 1}.\` [${track.title}](${track.uri}) | \`${track.isStream ? '🔴 Live' : msToHMS(track.duration)}\`\n\n` }
        description += `**${lang.other.songsInQueue(queue.length)} | ${lang.other.totalDuration(msToHMS(queue.duration))}**\n${'\u2015'.repeat(34)}`

        const embed = new EmbedBuilder()
          .setAuthor({ name: lang.author, iconURL: interaction.member.user.displayAvatarURL() })
          .setDescription(description)
          .setFooter({ text: `SuitBot | ${lang.other.page} ${pages.length + 1}/${Math.ceil(queue.length / 10)} | ${lang.other.repeatModes.repeat}: ${player.queueRepeat ? '🔁 ' + lang.other.repeatModes.queue : player.trackRepeat ? '🔂 ' + lang.other.repeatModes.track : '❌'}`, iconURL: interaction.client.user.displayAvatarURL() })
        pages.push(embed)
      }
    }

    const isOnePage = pages.length === 1

    const previous = new ButtonBuilder()
      .setCustomId('previous')
      .setLabel(lang.other.previous)
      .setStyle(ButtonStyle.Primary)
    const next = new ButtonBuilder()
      .setCustomId('next')
      .setLabel(lang.other.next)
      .setStyle(ButtonStyle.Primary)

    const embedMessage = await interaction.reply({ embeds: [pages[0]], components: isOnePage ? [] : [new ActionRowBuilder().setComponents([previous.setDisabled(true), next.setDisabled(false)])], fetchReply: true })

    if (!isOnePage) {
      // Collect button interactions (when a user clicks a button),
      const collector = embedMessage.createMessageComponentCollector({ idle: 150000 })
      let currentIndex = 0
      collector.on('collect', async (buttonInteraction) => {
        buttonInteraction.customId === 'previous' ? currentIndex -= 1 : currentIndex += 1
        await buttonInteraction.update({ embeds: [pages[currentIndex]], components: [new ActionRowBuilder({ components: [previous.setDisabled(currentIndex === 0), next.setDisabled(currentIndex === pages.length - 1)] })] })
      })
      collector.on('end', async () => {
        await embedMessage.edit({ components: [new ActionRowBuilder().setComponents([previous.setDisabled(true), next.setDisabled(true)])] })
      })
    }
  }
}
