import { logging } from '../utilities/logging.js'

export const { data, execute } = {
  data: { name: 'guildCreate' },
  async execute(guild) {
    logging.info(`Joined a new guild: ${guild.name}.`)
    await guild.client.database.addServer(guild)
  }
}
