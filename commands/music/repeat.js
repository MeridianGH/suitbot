const { SlashCommandBuilder } = require('@discordjs/builders');
const { simpleEmbed } = require('../../utilities');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('repeat')
        .setDescription('Sets the current repeat mode.')
        .addStringOption(option =>
            option.setName('mode')
                .setDescription('The query to search for.')
                .setRequired(true)
                .addChoice('None', 'none')
                .addChoice('Song', 'song')
                .addChoice('Queue', 'queue')),
    async execute(interaction) {
        const mode = interaction.options.getString('mode');
        const queue = interaction.client.player.getQueue(interaction.guild.id);
        if (!queue) { return await interaction.reply(simpleEmbed('Nothing currently playing.\nStart playback with /play!', true)); }

        let reply = 'Set repeat mode to ';
        switch (mode) {
        case 'none':
            queue.setRepeatMode(0);
            reply = reply + `\`None\` ▶`;
            break;
        case 'song':
            queue.setRepeatMode(1);
            reply = reply + `\`Song\` 🔂`;
            break;
        case 'queue':
            queue.setRepeatMode(2);
            reply = reply + `\`Queue\` 🔁`;
            break;
        }

        await interaction.reply(simpleEmbed(reply));
    },
};