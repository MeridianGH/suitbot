const { Client, Collection, Intents } = require('discord.js')
const Player = require('./music/Player')
const { getFilesRecursively, errorEmbed } = require('./utilities')

const token = process.env.token ?? require('./config.json').token

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES], presence: { status: 'online', activities: [{ name: '/help | suitbot.xyz', type: 'PLAYING' }] } })
client.player = new Player(client)

// Commands
client.commands = new Collection()
for (const file of getFilesRecursively('./commands')) {
  const command = require(`./${file}`)
  client.commands.set(command.data.name, command)
}

// Events
for (const file of getFilesRecursively('./events')) {
  const event = require(`./${file}`)
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args))
  } else {
    client.on(event.name, (...args) => event.execute(...args))
  }
}
process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)
process.on('uncaughtException', (error) => { console.log(`Ignoring uncaught exception: ${error} | ${error.stack.split(/\r?\n/)[1].split('\\').pop().slice(0, -1)}`) })

// Shutdown Handling
async function shutdown () {
  console.log(`Closing ${client.player.queues.size} queues.`)
  for (const entry of client.player.queues) {
    const queue = entry[1]
    if (queue.destroyed) { continue }
    await queue.channel.send(errorEmbed('Server shutdown', 'The server the bot is hosted on has been forced to shut down.\nThe bot should be up and running again in a few minutes.'))
    queue.stop()
  }
  client.destroy()
  client.dashboard.close()
  console.log('Received SIGTERM, shutting down.')
  process.exit(0)
}

// Login
client.login(token)
