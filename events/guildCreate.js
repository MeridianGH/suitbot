export const { data, execute } = {
  data: { name: 'guildCreate' },
  execute (guild) {
    console.log(`Joined a new guild: ${guild.name}.`)
  }
}
