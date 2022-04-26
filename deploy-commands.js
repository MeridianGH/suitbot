import discordRest from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import { getFilesRecursively } from './utilities/utilities.js'
import { token, appId, guildId } from './utilities/config.js'

const commands = []

for (const file of getFilesRecursively('./commands')) {
  const command = await import(`./${file}`)
  commands.push(command.data.toJSON())
}

const rest = new discordRest.REST({ version: '9' }).setToken(token)

if (process.argv.includes('global')) {
  rest.put(Routes.applicationCommands(appId), { body: commands })
    .then(() => console.log('Successfully registered global application commands.'))
    .catch((error) => console.log(error))
} else {
  rest.put(Routes.applicationGuildCommands(appId, guildId), { body: commands })
    .then(() => console.log('Successfully registered guild application commands.'))
    .catch((error) => console.log(error))
}
