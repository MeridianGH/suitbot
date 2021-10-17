const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, GuildMember, Permissions } = require('discord.js')
const { simpleEmbed } = require('../../utilities')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kicks a user.')
    .addMentionableOption(option => option.setName('user').setDescription('The user to kick.').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('The reason for the kick.')),
  async execute (interaction) {
    const member = interaction.options.getMentionable('user')
    const reason = interaction.options.getString('reason')

    if (!interaction.user.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) { return await interaction.reply(simpleEmbed('You do not have permission to execute this command!', true)) }
    if (!(member instanceof GuildMember)) { return await interaction.reply(simpleEmbed('You can only specify a valid user!', true)) }

    await member.kick(reason).catch(() => interaction.reply(simpleEmbed('There was an error when kicking this user.\nThe bot is possibly missing permissions.', true)))

    const embed = new MessageEmbed()
      .setAuthor('Kicked User', interaction.member.user.displayAvatarURL())
      .setTitle(member.displayName)
      .setThumbnail(member.user.displayAvatarURL({ format: 'png', size: 1024 }))
      .setDescription(`Reason: \`\`\`${reason}\`\`\``)
      .setFooter('SuitBot', interaction.client.user.displayAvatarURL())

    await interaction.reply({ embeds: [embed] })
  }
}
