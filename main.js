const fs = require('fs')
const { Client, Collection, Intents, MessageEmbed } = require('discord.js')
const { Player } = require('discord-music-player')
const { getFilesRecursively, errorEmbed } = require('./utilities')

const token = process.env.token ? process.env.token : require('./config.json').token

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES] })

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
process.on('uncaughtException', error => {
  fs.appendFile('errors.txt', `${error.stack}\n\n`, (e) => { if (e) { console.log('Failed logging error.') } })
  console.log('Ignoring uncaught exception: ' + error)
})
process.on('SIGTERM', async () => {
  for (const entry of client.player.queues) {
    const queue = entry[1]
    await queue.lastTextChannel.send(errorEmbed('Server shutdown', 'The server the bot is hosted on has been forced to shut down.\nThe bot should be up and running again in a few minutes.'))
    queue.destroy(true)
  }
  client.destroy()
  client.dashboard.close()
  console.log('Received SIGTERM, shutting down.')
  process.exit(0)
})

// Login
client.login(token)
