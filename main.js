const fs = require('fs')
const { Client, Collection, Intents } = require('discord.js')
const { Player } = require('discord-player')
const { getFilesRecursively, errorEmbed } = require('./utilities')

const token = process.env.token ?? require('./config.json').token

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES], presence: { status: 'online', activities: [{ name: '/help | suitbot.xyz', type: 'PLAYING' }] } })
client.player = new Player(client, {
  ytdlOptions: { requestOptions: { headers: { cookie: process.env.cookie ?? require('./config.json').cookie } } },
})
client.player.use('playdl', require('./extractor'))

// Add command files
client.commands = new Collection()

for (const file of getFilesRecursively('./commands')) {
  const command = require(`./${file}`)
  client.commands.set(command.data.name, command)
}

// Add event files
const eventObjects = { client: client, player: client.player, process: process }
const folders = fs.readdirSync('./events', { withFileTypes: true }).filter(entry => entry.isDirectory()).map(entry => entry.name)
for (const folder of folders) {
  const path = `./events/${folder}`
  const files = fs.readdirSync(path).filter(file => file.endsWith('.js'))
  for (const file of files) {
    const event = require(`${path}/${file}`)
    if (event.once) {
      eventObjects[folder].once(event.name, (...args) => event.execute(...args))
    } else {
      eventObjects[folder].on(event.name, (...args) => event.execute(...args))
    }
  }
}

// Shutdown Handling
async function shutdown () {
  console.log(`Closing ${client.player.queues.size} queues.`)
  for (const entry of client.player.queues) {
    const queue = entry[1]
    await queue.metadata.channel.send(errorEmbed('Server shutdown', 'The server the bot is hosted on has been forced to shut down.\nThe bot should be up and running again in a few minutes.'))
    queue.stop()
  }
  client.destroy()
  client.dashboard.close()
  console.log('Received SIGTERM, shutting down.')
  process.exit(0)
}
process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)

// Login
client.login(token)
