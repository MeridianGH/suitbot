const { SlashCommandBuilder } = require('@discordjs/builders')
const { simpleEmbed } = require('../../utilities')
const { MessageEmbed } = require('discord.js')
const guildId = process.env.guildId ? process.env.guildId : require('../../config.json').guildId

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bugreport')
    .setDescription('Reports a bug to the developer.')
    .addStringOption(option => option.setName('bug').setDescription('A description of the bug.').setRequired(true)),
  async execute (interaction) {
    const bug = interaction.options.getString('bug')
    const developerGuild = interaction.client.guilds.cache.get(guildId)
    const bugReportChannel = developerGuild.channels.cache.find(channel => (channel.name === 'bug-reports') && channel.isText())

    const embed = new MessageEmbed()
      .setAuthor('Bug report received', interaction.member.user.displayAvatarURL())
      .setTitle(`By \`${interaction.member.user.tag}\` in \`${interaction.guild.name}\``)
      .setDescription(bug)
      .setFooter('SuitBot', interaction.client.user.displayAvatarURL())

    bugReportChannel.send({ embeds: [embed], fetchReply: true })

    interaction.reply(simpleEmbed('Your bug report was sent successfully!'))
  }
}