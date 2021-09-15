const { SlashCommandBuilder } = require('@discordjs/builders');
const { simpleEmbed } = require('../../utilities');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('playlist')
        .setDescription('Plays an entire playlist from YouTube.')
        .addStringOption(option =>
            option.setName('link')
                .setDescription('The link of the playlist.')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();
        const channel = interaction.member.voice.channel;
        if (!channel) return interaction.reply(simpleEmbed('You need to be in a voice channel to use this command.'));

        const permissions = channel.permissionsFor(interaction.client.user);
        if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) return interaction.reply(simpleEmbed('I do not have the correct permissions to play in your voice channel!'));

        const link = interaction.options.getString('link');

        const guildQueue = interaction.client.player.getQueue(interaction.guild.id);
        const queue = interaction.client.player.createQueue(interaction.guild.id);
        queue.lastTextChannel = interaction.channel;

        await queue.join(channel);
        const song = await queue.playlist(link).catch(function() {
            if (!guildQueue) {
                queue.stop();
            }
        });
        await interaction.editReply(simpleEmbed(`Added ${song.name} to the queue.`));
    },
};