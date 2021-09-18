const fs = require('fs')
const { Client, Collection, Intents } = require('discord.js')
const { Player } = require('discord-music-player')
const { getFilesRecursively } = require('./utilities')

const token = process.env.token ? process.env.token : require('./config.json').token

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES] })

const player = new Player(client, { volume: 50 })
client.player = player

// Add command files
client.commands = new Collection()

for (const file of getFilesRecursively('./commands')) {
  const command = require(`./${file}`)
  client.commands.set(command.data.name, command)
}

// Add event files
const clientEventFiles = fs.readdirSync('./events/client').filter(file => file.endsWith('.js'))
const playerEventFiles = fs.readdirSync('./events/player').filter(file => file.endsWith('.js'))

for (const file of clientEventFiles) {
  const event = require(`./events/client/${file}`)
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args))
  } else {
    client.on(event.name, (...args) => event.execute(...args))
  }
}

for (const file of playerEventFiles) {
  const event = require(`./events/player/${file}`)
  client.player.on(event.name, (...args) => event.execute(...args))
}

// Login
client.login(token)
