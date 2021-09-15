const { SlashCommandBuilder } = require('@discordjs/builders');
const { simpleEmbed } = require('../../utilities');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stops playback.'),
    async execute(interaction) {
        interaction.client.player.getQueue(interaction.guild.id).stop();
        await interaction.reply(simpleEmbed('Stopped.'));
    },
};