const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const { simpleEmbed, errorEmbed } = require('../../utilities')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Plays a song or playlist from YouTube.')
    .addStringOption(option => option.setName('query').setDescription('The query to search for.').setRequired(true)),
  async execute (interaction) {
    const channel = interaction.member.voice.channel
    if (!channel) { return await interaction.reply(simpleEmbed('You need to be in a voice channel to use this command.', true)) }
    if (interaction.guild.me.voice.channel && (channel !== interaction.guild.me.voice.channel)) { return await interaction.reply(simpleEmbed('You need to be in the same voice channel as the bot to use this command!', true)) }
    if (!interaction.guild.me.permissionsIn(channel).has(['CONNECT', 'SPEAK'])) { return await interaction.reply(simpleEmbed('The bot does not have the correct permissions to play in your voice channel!', true)) }
    await interaction.deferReply()

    const queue = interaction.client.player.createQueue(interaction.guild.id)
    queue.setChannel(interaction.channel)

    await queue.join(channel)

    const result = await queue.play(interaction.options.getString('query'), { requestedBy: interaction.user })
    if (!result) { return await interaction.editReply(errorEmbed('Error', 'There was an error while adding your song to the queue.')) }

    const embed = new MessageEmbed()
      .setAuthor({ name: 'Added to queue.', iconURL: interaction.member.user.displayAvatarURL() })
      .setTitle(result.title)
      .setURL(result.url)
      .setThumbnail(result.thumbnail)
      .setFooter({ text: 'SuitBot', iconURL: interaction.client.user.displayAvatarURL() })

    if (result.playlist) {
      embed
        .addField('Amount', `${result.tracks.length} songs`, true)
        .addField('Author', result.author, true)
        .addField('Position', `${queue.tracks.indexOf(result.tracks[0]).toString()}-${queue.tracks.indexOf(result.tracks[result.tracks.length - 1]).toString()}`, true)
    } else {
      embed
        .addField('Duration', result.live ? '🔴 Live' : result.duration, true)
        .addField('Author', result.author, true)
        .addField('Position', queue.tracks.indexOf(result).toString(), true)
    }
    embed.addField('⚠ WARNING', 'The bot is using a new experimental music system.\nPlease report any bugs you encounter while using music commands or the dashboard!')

    await interaction.editReply({ embeds: [embed] })
  }
}
