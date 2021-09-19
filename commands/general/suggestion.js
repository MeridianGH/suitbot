const { SlashCommandBuilder } = require('@discordjs/builders')
const { simpleEmbed } = require('../../utilities')
const { MessageEmbed } = require('discord.js')
const guildId = process.env.guildId ? process.env.guildId : require('../../config.json').guildId

module.exports = {
  data: new SlashCommandBuilder()
    .setName('suggestion')
    .setDescription('Sends a suggestion to the developer.')
    .addStringOption(option => option.setName('suggestion').setDescription('The suggestion to send.').setRequired(true)),
  async execute (interaction) {
    const suggestion = interaction.options.getString('suggestion')
    const developerGuild = interaction.client.guilds.cache.get(guildId)
    const suggestionChannel = developerGuild.channels.cache.find(channel => (channel.name === 'suggestions') && channel.isText())

    const embed = new MessageEmbed()
      .setAuthor('Suggestion received', interaction.member.user.displayAvatarURL())
      .setTitle(`By \`${interaction.member.user.tag}\` in \`${interaction.guild.name}\``)
      .setDescription(suggestion)
      .setFooter('SuitBot', interaction.client.user.displayAvatarURL())

    suggestionChannel.send({ embeds: [embed], fetchReply: true }).then(async message => { await message.react('✅'); await message.react('❌') })

    interaction.reply(simpleEmbed('Your suggestion was sent successfully!'))
  }
}
