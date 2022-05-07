import { SlashCommandBuilder } from '@discordjs/builders'
import { MessageEmbed } from 'discord.js'
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

    const embed = new MessageEmbed()
      .setAuthor({ name: lang.author, iconURL: interaction.member.user.displayAvatarURL() })
      .setTitle(lang.title)
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .addField(lang.fields.servers.name, interaction.client.guilds.cache.size.toString(), true)
      .addField(lang.fields.uptime.name, uptime, true)
      .addField(lang.fields.memoryUsage.name, `heapUsed: ${Math.floor(process.memoryUsage().heapUsed / 1024 / 1024 * 100)}MB | heapTotal: ${Math.floor(process.memoryUsage().heapTotal / 1024 / 1024 * 100)}MB`)
      .setFooter({ text: 'SuitBot', iconURL: interaction.client.user.displayAvatarURL() })

    await interaction.reply({ embeds: [embed] })
  }
}
