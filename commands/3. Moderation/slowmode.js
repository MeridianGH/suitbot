import { SlashCommandBuilder } from '@discordjs/builders'
import { MessageEmbed, Permissions } from 'discord.js'
import { errorEmbed } from '../../utilities/utilities.js'
import { getLanguage } from '../../language/locale.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Sets the rate limit of the current channel.')
    .addIntegerOption((option) => option.setName('seconds').setDescription('The new rate limit in seconds.').setRequired(true)),
  async execute(interaction) {
    const lang = getLanguage(await interaction.client.database.getLocale(interaction.guildId)).slowmode
    const seconds = interaction.options.getInteger('seconds')

    if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) { return await interaction.reply(errorEmbed(lang.errors.userMissingPerms, true)) }
    if (!interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) { return await interaction.reply(errorEmbed(lang.errors.missingPerms, true)) }

    await interaction.channel.setRateLimitPerUser(seconds)

    const embed = new MessageEmbed()
      .setAuthor({ name: lang.author, iconURL: interaction.member.user.displayAvatarURL() })
      .setTitle(`#${interaction.channel.name}`)
      .setThumbnail(interaction.guild.iconURL())
      .setDescription(lang.description(interaction.channel.name, seconds))
      .setFooter({ text: 'SuitBot', iconURL: interaction.client.user.displayAvatarURL() })

    await interaction.reply({ embeds: [embed] })
  }
}
