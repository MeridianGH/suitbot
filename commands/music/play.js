const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { simpleEmbed } = require('../../utilities');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Searches and plays a song from YouTube.')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('The query to search for.')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();
        const channel = interaction.member.voice.channel;
        if (!channel) return interaction.reply(simpleEmbed('You need to be in a voice channel to use this command.'));

        const permissions = channel.permissionsFor(interaction.client.user);
        if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) return interaction.reply(simpleEmbed('I do not have the correct permissions to play in your voice channel!'));

        const query = interaction.options.getString('query');

        const guildQueue = interaction.client.player.getQueue(interaction.guild.id);
        const queue = interaction.client.player.createQueue(interaction.guild.id);
        queue.lastTextChannel = interaction.channel;

        await queue.join(channel);
        const song = await queue.play(query).catch(function() {
            if (!guildQueue) {
                queue.stop();
            }
        });
        await interaction.editReply({ embeds: [new MessageEmbed()
            .setAuthor('Added to queue.', `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}`)
            .setTitle(song.name)
            .setURL(song.url)
            .setThumbnail(song.thumbnail)
            .setFields(
                { name: 'Channel', value: song.author, inline: true},
                { name: 'Duration', value: song.duration, inline: true},
                { name: 'Position', value: (queue.songs.indexOf(song) + 1).toString(), inline: true},
            )
            .setFooter('SuitBot', 'https://cdn.discordapp.com/app-icons/887122733010411611/78c68033a9da502750c5165029b57817.png'),
        ]});
    },
};