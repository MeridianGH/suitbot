import { errorEmbed } from '../utilities.js'

export const { data, execute } = {
  data: { name: 'interactionCreate' },
  async execute (interaction) {
    if (!interaction.isCommand()) { return }
    if (interaction.guild === null) { return await interaction.reply(errorEmbed('Error', 'Commands are not supported in DMs.\nPlease use the bot in a server.')) }

    const command = interaction.client.commands.get(interaction.commandName)
    if (!command) { return }

    try {
      command.execute(interaction)
    } catch (error) {
      console.error(error)
      return await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
    }

    console.log(`${interaction.user.tag} triggered /${interaction.commandName} in #${interaction.channel.name}/${interaction.guild.name}.`)
  }
}
