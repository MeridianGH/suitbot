import { SlashCommandBuilder } from '@discordjs/builders'
import { GuildMember, MessageEmbed, Permissions } from 'discord.js'
import { simpleEmbed } from '../../utilities/utilities.js'
import locale from '../../language/locale.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bans a user.')
    .addMentionableOption((option) => option.setName('user').setDescription('The user to ban.').setRequired(true))
    .addStringOption((option) => option.setName('reason').setDescription('The reason for the ban.')),
  async execute(interaction) {
    const { ban: lang } = locale[await interaction.client.database.getLocale(interaction.guildId)]
    const member = interaction.options.getMentionable('user')
    const reason = interaction.options.getString('reason')

    if (!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) { return await interaction.reply(simpleEmbed(lang.errors.userMissingPerms, true)) }
    if (!(member instanceof GuildMember)) { return await interaction.reply(simpleEmbed(lang.errors.invalidUser, true)) }
    if (!member.bannable) { return await interaction.reply(simpleEmbed(lang.errors.missingPerms, true)) }

    await member.ban({ reason: reason }).catch(async () => await interaction.reply(simpleEmbed(lang.errors.generic, true)))

    const embed = new MessageEmbed()
      .setAuthor({ name: lang.author, iconURL: interaction.member.user.displayAvatarURL() })
      .setTitle(member.displayName)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 1024 }))
      .setDescription(lang.description(reason))
      .setFooter({ text: 'SuitBot', iconURL: interaction.client.user.displayAvatarURL() })

    await interaction.reply({ embeds: [embed] })
  }
}
