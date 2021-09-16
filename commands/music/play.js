const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { simpleEmbed } = require('../../utilities');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Searches and plays a song or playlist from YouTube or Spotify.')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('The query to search for.')
                .setRequired(true)),
    async execute(interaction) {
        const channel = interaction.member.voice.channel;
        if (!channel) { return interaction.reply(simpleEmbed('You need to be in a voice channel to use this command.', true)); }

        const permissions = channel.permissionsFor(interaction.client.user);
        if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) return interaction.reply(simpleEmbed('I do not have the correct permissions to play in your voice channel!', true));

        await interaction.deferReply();

        const query = interaction.options.getString('query');
        if (query.match(/^https?:\/\/(?:open|play)\.spotify\.com\/user\/([\w\d]+)\/playlist\/[\w\d]+$/i) ||
                   query.match(/^(?!.*\?.*\bv=)https:\/\/www\.youtube\.com\/.*\?.*\blist=.*$/i)) {
            await this._playPlaylist(interaction);
        } else {
            await this._playSong(interaction);
        }
    },

    async _playSong(interaction) {
        const guildQueue = interaction.client.player.getQueue(interaction.guild.id);
        const queue = interaction.client.player.createQueue(interaction.guild.id);
        queue.lastTextChannel = interaction.channel;

        await queue.join(interaction.member.voice.channel);
        const song = await queue.play(interaction.options.getString('query')).catch(function() {
            if (!guildQueue) {
                queue.stop();
            }
        });

        if (!song) {
            return await interaction.editReply(simpleEmbed('There was an error when processing your request.'))
        }
        song.requestedBy = interaction.member.displayName;

        await interaction.editReply({ embeds: [new MessageEmbed()
            .setAuthor('Added to queue.', `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}`)
            .setTitle(song.name)
            .setURL(song.url)
            .setThumbnail(song.thumbnail)
            .setFields(
                { name: 'Channel', value: song.author, inline: true},
                { name: 'Duration', value: song.duration, inline: true},
                { name: 'Position', value: queue.songs.indexOf(song).toString(), inline: true},
            )
            .setFooter('SuitBot', 'https://cdn.discordapp.com/app-icons/887122733010411611/78c68033a9da502750c5165029b57817.png'),
        ]});
    },

    async _playPlaylist(interaction) {
        const guildQueue = interaction.client.player.getQueue(interaction.guild.id);
        const queue = interaction.client.player.createQueue(interaction.guild.id);
        queue.lastTextChannel = interaction.channel;

        await queue.join(interaction.member.voice.channel);
        const playlist = await queue.playlist(interaction.options.getString('query')).catch(function() {
            if (!guildQueue) {
                queue.stop();
            }
        });

        if (!playlist) {
            return await interaction.editReply(simpleEmbed('There was an error when processing your request.'))
        }
        playlist.songs.forEach(song => {
            song.requestedBy = interaction.member.displayName;
        });

        await interaction.editReply({ embeds: [new MessageEmbed()
            .setAuthor('Added to queue.', `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}`)
            .setTitle(playlist.name)
            .setURL(playlist.url)
            .setThumbnail(playlist.songs[0].thumbnail)
            .setFields(
                { name: 'Author', value: playlist.author, inline: true},
                { name: 'Amount', value: `${playlist.songs.length} songs`, inline: true},
                { name: 'Position', value: `${queue.songs.indexOf(playlist.songs[0]).toString()}-${queue.songs.indexOf(playlist.songs[playlist.songs.length - 1]).toString()}`, inline: true},
            )
            .setFooter('SuitBot', 'https://cdn.discordapp.com/app-icons/887122733010411611/78c68033a9da502750c5165029b57817.png'),
        ]});
    },
};