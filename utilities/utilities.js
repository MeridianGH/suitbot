import { MessageEmbed } from 'discord.js'
import fs from 'fs'
import path from 'path'
import { iconURL } from '../events/ready.js'

export function simpleEmbed(content, ephemeral = false) {
  return {
    embeds: [new MessageEmbed()
      .setDescription(content)
      .setFooter({ text: 'SuitBot', iconURL: iconURL })
    ],
    ephemeral: ephemeral
  }
}

export function errorEmbed(content, ephemeral = false) {
  return {
    embeds: [new MessageEmbed()
      .setDescription(content)
      .setFooter({ text: 'SuitBot', iconURL: iconURL })
      .setColor('#ff0000')],
    ephemeral: ephemeral
  }
}

export function sleep(seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000))
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

export function timeSince(date) {
  const seconds = Math.floor((new Date() - date) / 1000)

  let interval = Math.floor(seconds / 31536000)
  if (interval > 1) { return Math.floor(interval) + (interval === 1 ? ' year' : ' years') + ' ago' }
  interval = seconds / 2592000
  if (interval > 1) { return Math.floor(interval) + (interval === 1 ? ' month' : ' months') + ' ago' }
  interval = seconds / 86400
  if (interval > 1) { return Math.floor(interval) + (interval === 1 ? ' day' : ' days') + ' ago' }
  interval = seconds / 3600
  if (interval > 1) { return Math.floor(interval) + (interval === 1 ? ' hour' : ' hours') + ' ago' }
  interval = seconds / 60
  if (interval > 1) { return Math.floor(interval) + (interval === 1 ? ' minute' : ' minutes') + ' ago' }
  return Math.floor(seconds) + (interval === 1 ? ' second' : ' seconds') + ' ago'
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
