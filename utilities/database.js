import postgres from 'postgres'

const sql = process.env.DATABASE_URL ? postgres(process.env.DATABASE_URL, { ssl: { rejectUnauthorized: false } }) : postgres('postgres://postgres:postgres@localhost:5432/suitbot')

export default {
  sql: sql,
  getLocale: async function getLocale(guildId) {
    return (await sql`select locale from servers where id = ${guildId};`)[0]?.locale ?? 'en-US'
  },
  setLocale: async function setLocale(guildId, locale) {
    await sql`update servers set ${sql({ locale: locale })} where id = ${guildId};`
  },
  addServer: async function addServer(guild) {
    await sql`insert into servers (id, locale) values (${guild.id}, ${guild.preferredLocale});`
  },
  addAllServers: async function addAllServers(guilds) {
    guilds = guilds.map((guild) => ({ id: guild.id, locale: guild.preferredLocale }))
    await sql`insert into servers ${sql(guilds)} on conflict (id) do nothing;`
  },
  removeServer: async function removeServer(guild) {
    await sql`delete from servers where id = ${guild.id};`
  }
}
