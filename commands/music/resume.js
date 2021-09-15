const { SlashCommandBuilder } = require('@discordjs/builders');
const { simpleEmbed } = require('../../utilities');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resumes playback.'),
    async execute(interaction) {
        interaction.client.player.getQueue(interaction.guild.id).setPaused(false);
        await interaction.reply(simpleEmbed('Resumed playback.'));
    },
};