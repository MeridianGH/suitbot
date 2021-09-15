const { SlashCommandBuilder } = require('@discordjs/builders');
const { simpleEmbed } = require('../../utilities');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Sets the volume of the music player.')
        .addIntegerOption(option =>
            option.setName('volume')
                .setDescription('The volume to set the player to.')
                .setRequired(true)),
    async execute(interaction) {
        const volume = interaction.options.getInteger('volume');
        interaction.client.player.getQueue(interaction.guild.id).setVolume(volume);
        await interaction.reply(simpleEmbed(`Set volume to ${volume}%.`));
    },
};