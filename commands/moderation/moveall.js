const { SlashCommandBuilder } = require('@discordjs/builders')
const { simpleEmbed } = require('../../utilities')
const { MessageEmbed } = require('discord.js')

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

    const embed = new MessageEmbed()
      .setAuthor('Moved All Users', `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}`)
      .setTitle(`${channel1.name} → ${channel2.name}`)
      .setThumbnail(interaction.guild.iconURL())
      .setDescription(`Moved all users from \`${channel1.name}\` to \`${channel2.name}\`.`)
      .setFooter('SuitBot', 'https://cdn.discordapp.com/app-icons/887122733010411611/78c68033a9da502750c5165029b57817.png')

    await interaction.reply({ embeds: [embed] })
  }
}
