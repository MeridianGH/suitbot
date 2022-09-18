import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v10'
import { getFilesRecursively } from './utilities/utilities.js'
import { appId, guildId, token } from './utilities/config.js'
import { logging } from './utilities/logging.js'

const commands = []

for (const file of getFilesRecursively('./commands')) {
  const command = await import(`./${file}`)
  commands.push(command.data.toJSON())
}

const rest = new REST({ version: '10' }).setToken(token)

if (process.argv.includes('global')) {
  rest.put(Routes.applicationCommands(appId), { body: commands })
    .then(() => logging.info('Successfully registered global application commands.'))
    .catch((error) => logging.error(error))
} else if (process.argv.includes('clear')) {
  Promise.all([ rest.put(Routes.applicationCommands(appId), { body: [] }), rest.put(Routes.applicationGuildCommands(appId, guildId), { body: [] })])
    .then(() => logging.info('Successfully cleared application commands.'))
    .catch((error) => logging.error(error))
} else {
  rest.put(Routes.applicationGuildCommands(appId, guildId), { body: commands })
    .then(() => logging.info('Successfully registered guild application commands.'))
    .catch((error) => logging.error(error))
}
