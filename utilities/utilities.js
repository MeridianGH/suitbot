// noinspection JSUnusedGlobalSymbols

import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js'
import fs from 'fs'
import path from 'path'
import { iconURL } from '../events/ready.js'
import _ from 'lodash'
import { getLanguage } from '../language/locale.js'

export function simpleEmbed(content, ephemeral = false) {
  return {
    embeds: [
      new EmbedBuilder()
        .setDescription(content)
        .setFooter({ text: 'SuitBot', iconURL: iconURL })
    ],
    ephemeral: ephemeral
  }
}

export function errorEmbed(content, ephemeral = false) {
  return {
    embeds: [
      new EmbedBuilder()
        .setDescription(content)
        .setFooter({ text: 'SuitBot', iconURL: iconURL })
        .setColor([255, 0, 0])
    ],
    ephemeral: ephemeral
  }
}

export function sleep(seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000))
}

export function objectDifference(oldObject, newObject) {
  return {
    old: _.pickBy(oldObject, (value, key) => !_.isEqual(value, newObject[key])),
    new: _.pickBy(newObject, (value, key) => !_.isEqual(oldObject[key], value))
  }
}

export function msToHMS(ms) {
  let totalSeconds = ms / 1000
  const hours = Math.floor(totalSeconds / 3600).toString()
  totalSeconds %= 3600
  const minutes = Math.floor(totalSeconds / 60).toString()
  const seconds = Math.floor(totalSeconds % 60).toString()
  return hours === '0' ? `${minutes}:${seconds.padStart(2, '0')}` : `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`
}

export function timeToMs(time) {
  const times = time.split(':')
  let seconds = 0; let secondsInUnit = 1
  while (times.length > 0) {
    seconds += secondsInUnit * parseInt(times.pop())
    secondsInUnit *= 60
  }
  return seconds * 1000
}

export function getFilesRecursively(directory, files) {
  const contents = fs.readdirSync(directory)
  files = files ?? []
  for (const file of contents) {
    const absolute = path.join(directory, file)
    if (fs.statSync(absolute).isDirectory()) {
      getFilesRecursively(absolute, files)
    } else {
      files.push(absolute)
    }
  }
  return files
}

export async function addMusicControls(message, player) {
  const { previous, pause, skip, stop, dashboard } = getLanguage(await message.client.database.getLocale(message.guildId))
  const previousButton = new ButtonBuilder()
    .setCustomId('previous')
    .setEmoji('⏮')
    .setStyle(ButtonStyle.Secondary)
  const pauseButton = new ButtonBuilder()
    .setCustomId('pause')
    .setEmoji('⏯')
    .setStyle(ButtonStyle.Secondary)
  const skipButton = new ButtonBuilder()
    .setCustomId('skip')
    .setEmoji('⏭')
    .setStyle(ButtonStyle.Secondary)
  const stopButton = new ButtonBuilder()
    .setCustomId('stop')
    .setEmoji('⏹')
    .setStyle(ButtonStyle.Secondary)
  const dashboardButton = new ButtonBuilder()
    // TODO: Fix hardcoded URLs
    .setURL(`https://suitbot.xyz/dashboard/${message.guildId}`)
    .setLabel(dashboard.author)
    .setStyle(ButtonStyle.Link)

  message.edit({ components: [new ActionRowBuilder().setComponents([previousButton, pauseButton, skipButton, stopButton, dashboardButton])] })

  const collector = message.createMessageComponentCollector({ idle: 150000 })
  collector.on('collect', async (buttonInteraction) => {
    // noinspection JSUnresolvedVariable

    if (buttonInteraction.member.voice.channel?.id !== player.voiceChannel) { return await buttonInteraction.reply(errorEmbed(previous.errors.sameChannel, true)) }

    switch (buttonInteraction.customId) {
      case 'previous': {
        if (player.position > 5000) {
          await player.seek(0)
          await buttonInteraction.deferUpdate()
          break
        }
        try {
          if (player.previousTracks.length === 0) { return await buttonInteraction.reply(errorEmbed(previous.errors.generic, true)) }
          const track = player.previousTracks.pop()
          player.queue.add(track, 0)
          player.manager.once('trackEnd', (player) => { player.queue.add(player.previousTracks.pop(), 0) })
          player.stop()
          await buttonInteraction.reply(simpleEmbed('⏮ ' + previous.other.response(`\`#0\`: **${track.title}**`), true))
        } catch (e) {
          await player.seek(0)
          await buttonInteraction.deferUpdate()
        }
        break
      }
      case 'pause': {
        player.pause(!player.paused)
        await buttonInteraction.reply(simpleEmbed(player.paused ? '⏸ ' + pause.other.paused : '▶ ' + pause.other.resumed, true))
        break
      }
      case 'skip': {
        if (player.queue.length === 0) {
          player.destroy()
          await buttonInteraction.reply(simpleEmbed('⏹ ' + stop.other.response, true))
          break
        }
        player.stop()
        await buttonInteraction.reply(simpleEmbed('⏭ ' + skip.other.skipped, true))
        break
      }
      case 'stop': {
        player.destroy()
        await buttonInteraction.reply(simpleEmbed('⏹ ' + stop.other.response, true))
        break
      }
    }
    message.client.dashboard.update(player)
  })
  collector.on('end', async () => {
    await message.edit({ components: [new ActionRowBuilder().setComponents([previousButton.setDisabled(true), pauseButton.setDisabled(true), skipButton.setDisabled(true), stopButton.setDisabled(true), dashboardButton.setDisabled(true)])] })
  })
}
