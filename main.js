const fs = require('fs')
const path = require('path')
const { Client, Collection, Intents } = require('discord.js')
const { Player } = require('discord-music-player')

// Check if running in Heroku
let token = process.env.token
if (!token) {
  const { configToken } = require('./config.json')
  token = configToken
}

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES] })

const player = new Player(client, { volume: 50 })
client.player = player

// Add command files
client.commands = new Collection()
const commandFiles = []

const getFilesRecursively = (directory) => {
  const filesInDirectory = fs.readdirSync(directory)
  for (const file of filesInDirectory) {
    const absolute = path.join(directory, file)
    if (fs.statSync(absolute).isDirectory()) {
      getFilesRecursively(absolute)
    } else {
      commandFiles.push(absolute)
    }
  }
}
getFilesRecursively('./commands/')

for (const file of commandFiles) {
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
