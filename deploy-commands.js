import discordRest from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import { getFilesRecursively } from './utilities/utilities.js'
import { token, appId, guildId } from './utilities/config.js'

const commands = []

for (const file of getFilesRecursively('./commands')) {
  const command = (await import(`./${file}`))
  commands.push(command.data.toJSON())
}

const rest = new discordRest.REST({ version: '9' }).setToken(token)

rest.put(Routes.applicationGuildCommands(appId, guildId), { body: commands })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(error => console.log(error))
