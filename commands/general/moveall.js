const { SlashCommandBuilder } = require('@discordjs/builders')
const { simpleEmbed } = require('../../utilities')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('moveall')
    .setDescription('Moves all users from the first channel to the second channel.')
    .addChannelOption(option =>
      option.setName('channel1')
        .setDescription('The channel to move from.')
        .setRequired(true))
    .addChannelOption(option =>
      option.setName('channel2')
        .setDescription('The channel to move to.')
        .setRequired(true)),
  async execute (interaction) {
    const channel1 = interaction.options.getChannel('channel1')
    const channel2 = interaction.options.getChannel('channel2')

    if (!channel1.isVoice() || !channel2.isVoice()) {
      return await interaction.reply(simpleEmbed('You can only specify a voice channel!', true))
    }

    for (const user of channel1.members) {
      await user[1].voice.setChannel(channel2)
    }

    await interaction.reply(simpleEmbed(`Moved all users from \`${channel1.name}\` to \`${channel2.name}\`.`))
  }
}
