export const { data, execute } = {
  data: { name: 'guildDelete' },
  async execute(guild) {
    console.log(`Removed from guild: ${guild.name}.`)
    await guild.client.database.removeServer(guild)
  }
}
