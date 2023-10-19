import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { getLanguage } from '../../language/locale.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Shows info about the server.'),
  async execute(interaction) {
    const lang = getLanguage(await interaction.client.database.getLocale(interaction.guildId)).serverinfo
    const guild = interaction.guild
    const created = Math.floor(guild.createdAt.getTime() / 1000)
    const embed = new EmbedBuilder()
      .setAuthor({ name: lang.author, iconURL: interaction.member.user.displayAvatarURL() })
      .setTitle(guild.name)
      .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }))
      .addFields([
        { name: lang.fields.members.name, value: guild.memberCount.toString(), inline: true },
        { name: lang.fields.channels.name, value: guild.channels.channelCountWithoutThreads.toString(), inline: true },
        { name: lang.fields.boosts.name, value: guild.premiumSubscriptionCount.toString() ?? '0', inline: true },
        { name: lang.fields.owner.name, value: `<@${guild.ownerId}>`, inline: true },
        { name: lang.fields.guildId.name, value: guild.id, inline: true },
        { name: '\u200b', value: '\u200b', inline: true },
        { name: lang.fields.created.name, value: `<t:${created}> (<t:${created}:R>)`, inline: false }
      ])
      .setFooter({ text: 'SuitBot', iconURL: interaction.client.user.displayAvatarURL() })

    await interaction.reply({ embeds: [embed] })
  }
}
