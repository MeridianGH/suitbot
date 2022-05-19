export const { data, execute } = {
  data: { name: 'guildCreate' },
  async execute(guild) {
    console.log(`Joined a new guild: ${guild.name}.`)
    await guild.client.database.addServer(guild)
  }
}
