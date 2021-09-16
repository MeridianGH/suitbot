const { SlashCommandBuilder } = require('@discordjs/builders');
const { simpleEmbed } = require('../../utilities');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Removes the specified track from the queue.')
        .addIntegerOption(option =>
            option.setName('track')
                .setDescription('The track to remove.')
                .setRequired(true)),
    async execute(interaction) {
        const track = interaction.options.getInteger('track');
        interaction.client.player.getQueue(interaction.guild.id).remove(track);
        await interaction.reply(simpleEmbed(`Removed track ${track}.`));
    },
};