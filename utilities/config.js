import { existsSync } from 'fs'
import { readFile } from 'fs/promises'

const file = new URL('../config.json', import.meta.url)
const config = existsSync(file) ? JSON.parse(await readFile(file)) : {}

if (process.env.token) {
  Object.keys(config).map(key => {
    config[key] = process.env[key]
  })
}

export const { token, appId, clientSecret, guildId, adminId, cookie, geniusAppId } = config
