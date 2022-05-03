import postgres from 'postgres'

const sql = postgres(process.env.DATABASE_URL ?? 'postgres://postgres:postgres@localhost:5432/suitbot')

export default {
  sql: sql,
  getSetting: async function getSetting(guildId, setting) {
    return sql`select ${setting} from servers where id = ${guildId};`
  },
  setSetting: async function setSetting(guildId, setting, value) {
    await sql`update servers set ${setting} = ${value} where id = ${guildId};`
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