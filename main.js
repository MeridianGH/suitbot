import { Client, Collection, Intents } from 'discord.js'
import { Player } from './music/Player.js'
import { errorEmbed, getFilesRecursively } from './utilities/utilities.js'

import { token } from './utilities/config.js'

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES], presence: { status: 'online', activities: [{ name: '/help | suitbot.xyz', type: 'PLAYING' }] } })
client.player = new Player(client)

// Commands
client.commands = new Collection()
for (const file of getFilesRecursively('./commands')) {
  const command = await import(`./${file}`)
  client.commands.set(command.data.name, command)
}

// Events
for (const file of getFilesRecursively('./events')) {
  const event = await import(`./${file}`)
  if (event.data.once) {
    client.once(event.data.name, (...args) => event.execute(...args))
  } else {
    client.on(event.data.name, (...args) => event.execute(...args))
  }
}
process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)
process.on('uncaughtException', (error) => { console.log(`Ignoring uncaught exception: ${error} | ${error.stack.split(/\r?\n/)[1].split('\\').pop().slice(0, -1)}`) })

// Shutdown Handling
async function shutdown() {
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
await client.login(token)
