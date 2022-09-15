import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { getLanguage } from '../../language/locale.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Shows info about the bot.'),
  async execute(interaction) {
    const lang = getLanguage(await interaction.client.database.getLocale(interaction.guildId)).info
    let totalSeconds = interaction.client.uptime / 1000
    const days = Math.floor(totalSeconds / 86400)
    totalSeconds %= 86400
    const hours = Math.floor(totalSeconds / 3600)
    totalSeconds %= 3600
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = Math.floor(totalSeconds % 60)
    const uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds.`

    const embed = new EmbedBuilder()
      .setAuthor({ name: lang.author, iconURL: interaction.member.user.displayAvatarURL() })
      .setTitle(lang.title)
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .addFields([
        { name: lang.fields.servers.name, value: interaction.client.guilds.cache.size.toString(), inline: true },
        { name: lang.fields.uptime.name, value: uptime, inline: true },
        { name: lang.fields.memoryUsage.name, value: `heapUsed: ${Math.floor(process.memoryUsage().heapUsed / 1024 / 1024 * 100)}MB | heapTotal: ${Math.floor(process.memoryUsage().heapTotal / 1024 / 1024 * 100)}MB`, inline: false }
      ])
      .setFooter({ text: 'SuitBot', iconURL: interaction.client.user.displayAvatarURL() })

    await interaction.reply({ embeds: [embed] })
  }
}
