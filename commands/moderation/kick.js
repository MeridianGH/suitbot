const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, GuildMember } = require('discord.js')
const { simpleEmbed } = require('../../utilities')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kicks a user.')
    .addMentionableOption(option =>
      option.setName('user')
        .setDescription('The user to kick.')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('The reason for the kick.')),
  async execute (interaction) {
    const user = interaction.options.getMentionable('user')
    if (!(user instanceof GuildMember)) {
      return await interaction.reply(simpleEmbed('You can only specify a valid user!', true))
    }
    const reason = interaction.options.getString('reason')

    await user.kick(reason).catch(() => interaction.reply(simpleEmbed('There was an error when kicking this user.\nThe bot is possibly missing permissions.', true)))

    const embed = new MessageEmbed()
      .setAuthor('Kicked User', `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}`)
      .setTitle(user.displayName)
      .setThumbnail(`https://cdn.discordapp.com/avatars/${user.user.id}/${user.user.avatar}`)
      .setDescription(`Reason: \`\`\`${reason}\`\`\``)
      .setFooter('SuitBot', 'https://cdn.discordapp.com/app-icons/887122733010411611/78c68033a9da502750c5165029b57817.png')

    await interaction.reply({ embeds: [embed] })
  }
}