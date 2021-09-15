const { SlashCommandBuilder } = require('@discordjs/builders');
const { simpleEmbed } = require('../../utilities');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skips the current song.'),
    async execute(interaction) {
        interaction.client.player.getQueue(interaction.guild.id).skip();
        await interaction.reply(simpleEmbed('Skipped.'));
    },
};