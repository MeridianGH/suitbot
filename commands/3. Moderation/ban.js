import { SlashCommandBuilder } from '@discordjs/builders'
import { GuildMember, MessageEmbed, Permissions } from 'discord.js'
import { simpleEmbed } from '../../utilities.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bans a user.')
    .addMentionableOption(option => option.setName('user').setDescription('The user to ban.').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('The reason for the ban.')),
  async execute (interaction) {
    const member = interaction.options.getMentionable('user')
    const reason = interaction.options.getString('reason')

    if (!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) { return await interaction.reply(simpleEmbed('You do not have permission to execute this command!', true)) }
    if (!(member instanceof GuildMember)) { return await interaction.reply(simpleEmbed('You can only specify a valid user!', true)) }
    if (!member.bannable) { return await interaction.reply(simpleEmbed('The bot is missing permissions to ban that user!', true)) }

    await member.ban({ reason: reason }).catch(async () => await interaction.reply(simpleEmbed('There was an error when banning this user.', true)))

    const embed = new MessageEmbed()
      .setAuthor({ name: 'Banned User', iconURL: interaction.member.user.displayAvatarURL() })
      .setTitle(member.displayName)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 1024 }))
      .setDescription(`Reason: \`\`\`${reason}\`\`\``)
      .setFooter({ text: 'SuitBot', iconURL: interaction.client.user.displayAvatarURL() })

    await interaction.reply({ embeds: [embed] })
  }
}
