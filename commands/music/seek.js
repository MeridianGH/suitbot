const { SlashCommandBuilder } = require('@discordjs/builders');
const { simpleEmbed } = require('../../utilities');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('seek')
        .setDescription('Skips to the specified point in the current track.')
        .addIntegerOption(option =>
            option.setName('seconds')
                .setDescription('The seconds to skip to.')
                .setRequired(true)),
    async execute(interaction) {
        const seconds = interaction.options.getInteger('seconds');
        interaction.client.player.getQueue(interaction.guild.id).seek(seconds * 1000);
        await interaction.reply(simpleEmbed(`Skipped to ${seconds}s.`));
    },
};