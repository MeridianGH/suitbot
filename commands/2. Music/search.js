const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js')
const { simpleEmbed, errorEmbed } = require('../../utilities')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('search')
    .setDescription('Searches five songs from YouTube and lets you select one to play.')
    .addStringOption(option => option.setName('query').setDescription('The query to search for.').setRequired(true)),
  async execute (interaction) {
    const channel = interaction.member.voice.channel
    if (!channel) { return await interaction.reply(simpleEmbed('You need to be in a voice channel to use this command.', true)) }
    if (interaction.guild.me.voice.channel && (channel !== interaction.guild.me.voice.channel)) { return await interaction.reply(simpleEmbed('You need to be in the same voice channel as the bot to use this command!', true)) }
    if (!interaction.guild.me.permissionsIn(channel).has(['CONNECT', 'SPEAK'])) { return await interaction.reply(simpleEmbed('The bot does not have the correct permissions to play in your voice channel!', true)) }
    await interaction.deferReply()

    const queue = interaction.client.player.createQueue(interaction.guild.id)
    queue.setChannel(interaction.channel)

    const result = await queue.search(interaction.options.getString('query'), { requestedBy: interaction.user })
    if (!result) { return await interaction.editReply(errorEmbed('Error', 'There was an error while searching for your query.')) }

    // noinspection JSCheckFunctionSignatures
    const selectMenu = new MessageSelectMenu()
      .setCustomId('search')
      .setPlaceholder('Select a song...')
      .addOptions([
        { label: result[0].title, description: result[0].author, value: '0' },
        { label: result[1].title, description: result[1].author, value: '1' },
        { label: result[2].title, description: result[2].author, value: '2' },
        { label: result[3].title, description: result[3].author, value: '3' },
        { label: result[4].title, description: result[4].author, value: '4' }
      ])

    const embedMessage = await interaction.editReply({
      embeds: [new MessageEmbed()
        .setAuthor({ name: 'Search Results.', iconURL: interaction.member.user.displayAvatarURL() })
        .setTitle(`Here are the search results for your search\n"\`${interaction.options.getString('query')}\`":`)
        .setThumbnail(result[0].thumbnail)
        .setFooter({ text: 'SuitBot | This embed expires after one minute.', iconURL: interaction.client.user.displayAvatarURL() })
      ],
      components: [new MessageActionRow({ components: [selectMenu] })],
      fetchReply: true
    })

    // noinspection JSCheckFunctionSignatures
    const collector = embedMessage.createMessageComponentCollector({ time: 60000, filter: async c => { await c.deferUpdate(); return c.user.id === interaction.user.id } })
    collector.on('collect', async menuInteraction => {
      const track = result[Number(menuInteraction.values[0])]
      await queue.join(channel)
      await queue.play(track)

      // noinspection JSCheckFunctionSignatures
      await menuInteraction.editReply({
        embeds: [new MessageEmbed()
          .setAuthor({ name: 'Added to queue.', iconURL: interaction.member.user.displayAvatarURL() })
          .setTitle(track.title)
          .setURL(track.url)
          .setThumbnail(track.thumbnail)
          .addField('Duration', track.live ? '🔴 Live' : track.duration, true)
          .addField('Author', track.author, true)
          .addField('Position', queue.tracks.indexOf(track).toString(), true)
          .addField('⚠ WARNING', 'The bot is using a new experimental music system.\nPlease report any bugs you encounter while using music commands or the dashboard!')
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
