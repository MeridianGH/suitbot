import { existsSync } from 'fs'
import { readFile } from 'fs/promises'

const config = existsSync('../config.json') ? JSON.parse(await readFile(new URL('../config.json', import.meta.url))) : null

if (process.env.token) {
  Object.keys(config).map(key => {
    config[key] = process.env[key]
  })
}

export const { token, appId, clientSecret, guildId, adminId, cookie, geniusAppId } = config
