import { logging } from '../utilities/logging.js'

export const { data, execute } = {
  data: { name: 'guildDelete' },
  async execute(guild) {
    logging.info(`Removed from guild: ${guild.name}.`)
    await guild.client.database.removeServer(guild)
  }
}
