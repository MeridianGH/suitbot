import { SlashCommandBuilder } from '@discordjs/builders'
import { MessageEmbed } from 'discord.js'
import { errorEmbed } from '../../utilities/utilities.js'
import locale from '../../language/locale.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Plays a song or playlist from YouTube.')
    .addStringOption((option) => option.setName('query').setDescription('The query to search for.').setRequired(true)),
  async execute(interaction) {
    const { play: lang } = locale[await interaction.client.database.getLocale(interaction.guildId)]
    const channel = interaction.member.voice.channel
    if (!channel) { return await interaction.reply(errorEmbed(lang.errors.noVoiceChannel, true)) }
    if (interaction.guild.me.voice.channel && channel !== interaction.guild.me.voice.channel) { return await interaction.reply(errorEmbed(lang.errors.sameChannel, true)) }
    if (!interaction.guild.me.permissionsIn(channel).has(['CONNECT', 'SPEAK'])) { return await interaction.reply(errorEmbed(lang.errors.missingPerms, true)) }
    await interaction.deferReply()

    const queue = interaction.client.player.createQueue(interaction.guild.id)
    queue.setChannel(interaction.channel)

    await queue.join(channel)

    const result = await queue.play(interaction.options.getString('query'), { requestedBy: interaction.user })
    if (!result) { return await interaction.editReply(errorEmbed(lang.errors.generic)) }

    const embed = new MessageEmbed()
      .setAuthor({ name: lang.author, iconURL: interaction.member.user.displayAvatarURL() })
      .setTitle(result.title)
      .setURL(result.url)
      .setThumbnail(result.thumbnail)
      .setFooter({ text: 'SuitBot', iconURL: interaction.client.user.displayAvatarURL() })

    if (result.playlist) {
      embed
        .addField(lang.fields.amount.name, lang.fields.amount.value(result.tracks.length), true)
        .addField(lang.fields.author.name, result.author, true)
        .addField(lang.fields.position.name, `${queue.tracks.indexOf(result.tracks[0]).toString()}-${queue.tracks.indexOf(result.tracks[result.tracks.length - 1]).toString()}`, true)
    } else {
      embed
        .addField(lang.fields.duration.name, result.live ? '🔴 Live' : result.duration, true)
        .addField(lang.fields.author.name, result.author, true)
        .addField(lang.fields.position.name, queue.tracks.indexOf(result).toString(), true)
    }

    await interaction.editReply({ embeds: [embed] })
  }
}
