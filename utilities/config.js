// noinspection JSCheckFunctionSignatures

import { existsSync, readFileSync } from 'fs'

const file = new URL('../config.json', import.meta.url)
const config = existsSync(file) ? JSON.parse(readFileSync(file)) : {}

export const { token, appId, clientSecret, guildId, adminId, papisid, psid, geniusAppId } = config
