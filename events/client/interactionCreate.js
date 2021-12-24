const { errorEmbed } = require('../../utilities')

module.exports = {
  name: 'interactionCreate',
  execute (interaction) {
    if (!interaction.isCommand()) { return }
    if (interaction.guild == null) { return interaction.reply(errorEmbed('Error', 'Commands are not supported in DMs.\nPlease use the bot in a server.')) }

    const command = interaction.client.commands.get(interaction.commandName)
    if (!command) { return }

    try {
      command.execute(interaction)
    } catch (error) {
      console.error(error)
      return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
    }

    console.log(`${interaction.user.tag} triggered /${interaction.commandName} in #${interaction.channel.name}/${interaction.guild.name}.`)
  }
}
