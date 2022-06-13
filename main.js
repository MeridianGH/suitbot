import { Client, Collection, Intents, MessageEmbed } from 'discord.js'
import database from './utilities/database.js'
import { Lavalink } from './music/lavalink.js'
import { getFilesRecursively } from './utilities/utilities.js'

import { token } from './utilities/config.js'
import { getLanguage } from './language/locale.js'
import { iconURL } from './events/ready.js'

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES], presence: { status: 'online', activities: [{ name: '/help | suitbot.xyz', type: 'PLAYING' }] } })
client.database = database
client.lavalink = new Lavalink(client)
const lavalink = await client.lavalink.initialize()

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
  console.log(`Closing ${client.lavalink.manager.players.size} queues.`)
  for (const entry of client.lavalink.manager.players) {
    const player = entry[1]
    const lang = getLanguage(await client.database.getLocale(player.guild)).serverShutdown
    // noinspection JSUnresolvedFunction
    await client.channels.cache.get(player.textChannel).send({
      embeds: [
        new MessageEmbed()
          .setTitle(lang.title)
          .setDescription(lang.description)
          .setFooter({ text: 'SuitBot', iconURL: iconURL })
          .setColor('#ff0000')
      ]
    })
    player.destroy()
  }
  lavalink.kill()
  client.destroy()
  client.dashboard.shutdown()
  console.log('Received SIGTERM, shutting down.')
  process.exit(0)
}

// Login
await client.login(token)
