const { SlashCommandBuilder } = require('@discordjs/builders');
const { simpleEmbed } = require('../../utilities');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clears the queue.'),
    async execute(interaction) {
        interaction.client.player.getQueue(interaction.guild.id).clearQueue();
        await interaction.reply(simpleEmbed('Cleared the queue.'));
    },
};