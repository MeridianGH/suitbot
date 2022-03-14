const { SlashCommandBuilder } = require('@discordjs/builders')
const { Utils } = require('discord-music-player')
const { simpleEmbed, errorEmbed } = require('../../utilities')
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('search')
    .setDescription('Searches five songs from YouTube and lets you select one to play.')
    .addStringOption(option => option.setName('query').setDescription('The query to search for.').setRequired(true)),
  async execute (interaction) {
    const channel = interaction.member.voice.channel
    if (!channel) { return await interaction.reply(simpleEmbed('You need to be in a voice channel to use this command.', true)) }
    if (interaction.guild.me.voice.channel && (channel !== interaction.guild.me.voice.channel)) { return await interaction.reply(simpleEmbed('You need to be in the same voice channel as the bot to use this command!', true)) }
    if (!interaction.guild.me.permissionsIn(channel).has(['CONNECT', 'SPEAK'])) return await interaction.reply(simpleEmbed('The bot does not have the correct permissions to play in your voice channel!', true))
    await interaction.deferReply()

    const queue = interaction.client.player.createQueue(interaction.guild.id)
    queue.setData({ channel: interaction.channel })

    const query = interaction.options.getString('query')
    const search = await Utils.search(query, { requestedBy: interaction.member.displayName }, queue, 5)
    const selectMenu = new MessageSelectMenu()
      .setCustomId('search')
      .setPlaceholder('Select a song...')
      .addOptions([
        { label: search[0].name, description: search[0].author, value: '0' },
        { label: search[1].name, description: search[1].author, value: '1' },
        { label: search[2].name, description: search[2].author, value: '2' },
        { label: search[3].name, description: search[3].author, value: '3' },
        { label: search[4].name, description: search[4].author, value: '4' }
      ])
    const embedMessage = await interaction.editReply({
      embeds: [new MessageEmbed()
        .setAuthor({ name: 'Search Results.', iconURL: interaction.member.user.displayAvatarURL() })
        .setTitle(`Here are the search results for your search "\`${query}\`":`)
        .setThumbnail(search[0].thumbnail)
        .setFooter({ text: 'SuitBot | This embed expires in one minute.', iconURL: interaction.client.user.displayAvatarURL() })
      ],
      components: [new MessageActionRow({ components: [selectMenu] })],
      fetchReply: true
    })

    const collector = embedMessage.createMessageComponentCollector({ time: 60000 })
    collector.on('collect', async menuInteraction => {
      if (menuInteraction.member.id !== interaction.member.id) { return await menuInteraction.reply(errorEmbed('Error', 'Only the original user may select a song!', true)) }
      await menuInteraction.deferUpdate()

      await queue.join(interaction.member.voice.channel)
      const song = await queue.play(search[Number(menuInteraction.values[0])]).catch(() => { if (!queue) { queue.stop() } })
      if (!song) { return await menuInteraction.update(errorEmbed('Error', 'There was an error while adding your song to the queue.')) }

      await menuInteraction.editReply({
        embeds: [new MessageEmbed()
          .setAuthor({ name: 'Added to queue.', iconURL: interaction.member.user.displayAvatarURL() })
          .setTitle(song.name)
          .setURL(song.url)
          .setThumbnail(song.thumbnail)
          .addField('Channel', song.author, true)
          .addField('Duration', song.duration, true)
          .addField('Position', queue.songs.indexOf(song).toString(), true)
          .setFooter({ text: 'SuitBot', iconURL: interaction.client.user.displayAvatarURL() })
        ],
        components: []
      })

      collector.stop()
    })
    collector.on('end', async () => {
      if (!queue.nowPlaying) { queue.stop() }
      await embedMessage.edit({ components: [] })
    })
  }
}
