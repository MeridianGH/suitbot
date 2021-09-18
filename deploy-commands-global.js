const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const { getFilesRecursively } = require('./utilities')

const token = process.env.token ? process.env.token : require('./config.json').token
const appId = process.env.appId ? process.env.appId : require('./config.json').appId

const commands = []

for (const file of getFilesRecursively('./commands')) {
  const command = require(`./${file}`)
  commands.push(command.data.toJSON())
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
  try {
    await rest.put(
      Routes.applicationCommands(appId),
      { body: commands }
    )

    console.log('Successfully registered application commands.')
  } catch (error) {
    console.error(error)
  }
})()
