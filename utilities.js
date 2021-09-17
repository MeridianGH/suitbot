const { MessageEmbed } = require('discord.js')

module.exports = {
  sleep: function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  },
  simpleEmbed: function (content, ephemeral = false) {
    return { embeds: [new MessageEmbed().setDescription(content)], ephemeral: ephemeral }
  },
  msToHMS: function (ms) {
    let totalSeconds = (ms / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    totalSeconds %= 3600
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = Math.floor(totalSeconds % 60)
    return (`${hours}:${minutes}:${seconds}`)
  }
}

// const { simpleEmbed } = require('../../utilities');
