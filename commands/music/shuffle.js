const { SlashCommandBuilder } = require('@discordjs/builders');
const { simpleEmbed } = require('../../utilities');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffles the queue.'),
    async execute(interaction) {
        interaction.client.player.getQueue(interaction.guild.id).shuffle();
        await interaction.reply(simpleEmbed('Shuffled the queue.'));
    },
};