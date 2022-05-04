import { SlashCommandBuilder } from '@discordjs/builders'
import { MessageActionRow, MessageEmbed, MessageSelectMenu } from 'discord.js'
import { errorEmbed, simpleEmbed } from '../../utilities/utilities.js'
import locale from '../../language/locale.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('search')
    .setDescription('Searches five songs from YouTube and lets you select one to play.')
    .addStringOption((option) => option.setName('query').setDescription('The query to search for.').setRequired(true)),
  async execute(interaction) {
    const { search: lang, play } = locale[await interaction.client.database.getLocale(interaction.guildId)]
    const channel = interaction.member.voice.channel
    if (!channel) { return await interaction.reply(simpleEmbed(lang.errors.noVoiceChannel, true)) }
    if (interaction.guild.me.voice.channel && channel !== interaction.guild.me.voice.channel) { return await interaction.reply(errorEmbed(lang.errors.sameChannel, true)) }
    if (!interaction.guild.me.permissionsIn(channel).has(['CONNECT', 'SPEAK'])) { return await interaction.reply(errorEmbed(lang.errors.missingPerms, true)) }
    await interaction.deferReply()

    const queue = interaction.client.player.createQueue(interaction.guild.id)
    queue.setChannel(interaction.channel)

    const result = await queue.search(interaction.options.getString('query'), { requestedBy: interaction.user })
    if (!result) { return await interaction.editReply(errorEmbed(lang.errors.generic)) }

    // noinspection JSCheckFunctionSignatures
    const selectMenu = new MessageSelectMenu()
      .setCustomId('search')
      .setPlaceholder(lang.other.select)
      .addOptions([
        { label: result[0].title, description: result[0].author, value: '0' },
        { label: result[1].title, description: result[1].author, value: '1' },
        { label: result[2].title, description: result[2].author, value: '2' },
        { label: result[3].title, description: result[3].author, value: '3' },
        { label: result[4].title, description: result[4].author, value: '4' }
      ])

    const embedMessage = await interaction.editReply({
      embeds: [
        new MessageEmbed()
          .setAuthor({ name: lang.author, iconURL: interaction.member.user.displayAvatarURL() })
          .setTitle(lang.title(interaction.options.getString('query')))
          .setThumbnail(result[0].thumbnail)
          .setFooter({ text: `SuitBot | ${lang.other.expires}`, iconURL: interaction.client.user.displayAvatarURL() })
      ],
      components: [new MessageActionRow({ components: [selectMenu] })],
      fetchReply: true
    })

    // noinspection JSCheckFunctionSignatures
    const collector = embedMessage.createMessageComponentCollector({ time: 60000, filter: async (c) => { await c.deferUpdate(); return c.user.id === interaction.user.id } })
    collector.on('collect', async (menuInteraction) => {
      const track = result[Number(menuInteraction.values[0])]
      await queue.join(channel)
      await queue.play(track)

      // noinspection JSCheckFunctionSignatures
      await menuInteraction.editReply({
        embeds: [
          new MessageEmbed()
            .setAuthor({ name: play.author, iconURL: interaction.member.user.displayAvatarURL() })
            .setTitle(track.title)
            .setURL(track.url)
            .setThumbnail(track.thumbnail)
            .addField(play.fields.duration.name, track.live ? '🔴 Live' : track.duration, true)
            .addField(play.fields.author.name, track.author, true)
            .addField(play.fields.position.name, queue.tracks.indexOf(track).toString(), true)
            .setFooter({ text: 'SuitBot', iconURL: interaction.client.user.displayAvatarURL() })
        ],
        components: []
      })

      collector.stop()
    })
    collector.on('end', async () => {
      await embedMessage.edit({ components: [] })
    })
  }
}
