export const { data, execute } = {
  data: { name: 'guildCreate' },
  async execute(guild) {
    console.log(`Joined a new guild: ${guild.name}.`)
    guild.client.database.addServer(guild)
  }
}
