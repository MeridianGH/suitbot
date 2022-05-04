import postgres from 'postgres'

const sql = postgres(process.env.DATABASE_URL ?? 'postgres://postgres:postgres@localhost:5432/suitbot')

export default {
  sql: sql,
  getLocale: async function getLocale(guildId) {
    return sql`select locale from servers where id = ${guildId};`
  },
  setLocale: async function setLocale(guildId, locale) {
    await sql`update servers set ${sql({ locale: locale })} where id = ${guildId};`
  },
  getSetting: async function getSetting(guildId, setting) {
    return sql`select ${setting} from servers where id = ${guildId};`
  },
  setSetting: async function setSetting(guildId, setting, value) {
    await sql`update servers set ${sql({ [setting]: value })} where id = ${guildId};`
  },
  getSettings: async function getSettings(guildId) {
    const settings = (await sql`select * from servers where id = ${guildId};`)[0]
    delete settings.id
    return settings
  },
  addServer: async function addServer(guild) {
    await sql`insert into servers (id, locale) values (${guild.id}, ${guild.preferredLocale});`
  },
  addAllServers: async function addAllServers(guilds) {
    guilds = guilds.map((guild) => ({ id: guild.id, locale: guild.preferredLocale }))
    await sql`insert into servers ${sql(guilds)} on conflict (id) do nothing;`
  },
}