const { SlashCommandBuilder } = require('@discordjs/builders');
const { simpleEmbed } = require('../../utilities');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pauses playback.'),
    async execute(interaction) {
        interaction.client.player.getQueue(interaction.guild.id).setPaused(true);
        await interaction.reply(simpleEmbed('Paused playback.'));
    },
};