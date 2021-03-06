import { SlashCommandBuilder } from '@discordjs/builders'
import { MessageEmbed } from 'discord.js'
import { getLanguage } from '../../language/locale.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Shows info about the server.'),
  async execute(interaction) {
    const lang = getLanguage(await interaction.client.database.getLocale(interaction.guildId)).serverinfo
    const guild = interaction.guild
    const created = Math.floor(guild.createdAt.getTime() / 1000)
    const embed = new MessageEmbed()
      .setAuthor({ name: lang.author, iconURL: interaction.member.user.displayAvatarURL() })
      .setTitle(guild.name)
      .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }))
      .addField(lang.fields.members.name, guild.memberCount.toString(), true)
      .addField(lang.fields.channels.name, guild.channels.channelCountWithoutThreads.toString(), true)
      .addField(lang.fields.boosts.name, guild.premiumSubscriptionCount.toString() ?? '0', true)
      .addField(lang.fields.owner.name, `<@${guild.ownerId}>`, true)
      .addField(lang.fields.guildId.name, guild.id, true)
      .addField('\u200b', '\u200b', true)
      .addField(lang.fields.created.name, `<t:${created}> (<t:${created}:R>)`)
      .setFooter({ text: 'SuitBot', iconURL: interaction.client.user.displayAvatarURL() })

    await interaction.reply({ embeds: [embed] })
  }
}
