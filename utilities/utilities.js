// noinspection JSUnusedGlobalSymbols

import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js'
import fs from 'fs'
import path from 'path'
import { iconURL } from '../events/ready.js'
import _ from 'lodash'

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

export function addMusicControls(message, player) {
  const previous = new ButtonBuilder()
    .setCustomId('previous')
    .setEmoji('⏮')
    .setStyle(ButtonStyle.Secondary)
  const pause = new ButtonBuilder()
    .setCustomId('pause')
    .setEmoji('⏯')
    .setStyle(ButtonStyle.Secondary)
  const skip = new ButtonBuilder()
    .setCustomId('skip')
    .setEmoji('⏭')
    .setStyle(ButtonStyle.Secondary)
  const stop = new ButtonBuilder()
    .setCustomId('stop')
    .setEmoji('⏹')
    .setStyle(ButtonStyle.Secondary)

  message.edit({ components: [new ActionRowBuilder().setComponents([previous, pause, skip, stop])] })

  const collector = message.createMessageComponentCollector({ idle: 150000 })
  collector.on('collect', async (buttonInteraction) => {
    switch (buttonInteraction.customId) {
      case 'previous': {
        if (player.position > 5000) {
          await player.seek(0)
          break
        }
        try {
          if (player.previousTracks.length === 0) { break }
          const track = player.previousTracks.pop()
          player.queue.add(track, 0)
          player.manager.once('trackEnd', (player) => { player.queue.add(player.previousTracks.pop(), 0) })
          player.stop()
        } catch (e) {
          await player.seek(0)
        }
        break
      }
      case 'pause': {
        player.pause(!player.paused)
        break
      }
      case 'skip': {
        if (player.queue.length === 0) {
          player.destroy()
          break
        }
        player.stop()
        break
      }
      case 'stop': {
        player.destroy()
        break
      }
    }
    message.client.dashboard.update(player)
    await buttonInteraction.deferUpdate()
  })
  collector.on('end', async (collected) => {
    await collected.first()?.message.edit({ components: [new ActionRowBuilder().setComponents([previous.setDisabled(true), pause.setDisabled(true), skip.setDisabled(true), stop.setDisabled(true)])] })
  })
}
