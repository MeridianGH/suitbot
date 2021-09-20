const { SlashCommandBuilder } = require('@discordjs/builders')
const { simpleEmbed } = require('../../utilities')
const discordRest = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('activity')
    .setDescription('Creates a Discord activity.')
    .addStringOption(option => option.setName('activity').setDescription('The activity to create.').setRequired(true)
      .addChoice('YouTube Together', '755600276941176913')
      .addChoice('Poker Night', '755827207812677713')
      .addChoice('Betrayal.io', '773336526917861400')
      .addChoice('Fishington.io', '814288819477020702')
      .addChoice('Chess in the Park', '832012774040141894'))
    .addChannelOption(option => option.setName('channel').setDescription('The voice channel to create the activity in.').setRequired(true)),
  async execute (interaction) {
    const channel = interaction.options.getChannel('channel')
    if (!channel.isVoice()) {
      return await interaction.reply(simpleEmbed('You can only specify a voice channel!', true))
    }

    const rest = new discordRest.REST({ version: '9' }).setToken(interaction.client.token)

    await rest.post(Routes.channelInvites(channel.id), { body: { target_application_id: interaction.options.getString('activity'), target_type: 2 } })
      .then(response => interaction.reply(simpleEmbed(`[Click here to open Activity](https://discord.gg/${response.code})`)))
      .catch(error => console.log(error))
  }
}
