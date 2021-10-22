const { SlashCommandBuilder } = require('@discordjs/builders')
const { simpleEmbed } = require('../../utilities')
const { Permissions } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Clears a specified amount of messages.')
    .addIntegerOption(option => option.setName('amount').setDescription('The amount of messages to clear.').setRequired(true)),
  async execute (interaction) {
    let amount = interaction.options.getInteger('amount')
    amount = amount.toString()

    if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) { return await interaction.reply(simpleEmbed('You do not have permission to execute this command!', true)) }
    if (amount < 1 || amount > 100) { return await interaction.reply(simpleEmbed('You can only delete between 1-100 messages!', true)) }

    await interaction.channel.messages.fetch({ limit: amount }).then(messages => {
      interaction.channel.bulkDelete(messages)
    })
    await interaction.reply(simpleEmbed(`Deleted ${amount} message(s).`, true))
  }
}
