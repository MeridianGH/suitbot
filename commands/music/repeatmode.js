const { SlashCommandBuilder } = require('@discordjs/builders');
const { simpleEmbed } = require('../../utilities');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('repeatmode')
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
        switch (mode) {
        case 'none':
            interaction.client.player.getQueue(interaction.guild.id).setRepeatMode(0);
            break;
        case 'song':
            interaction.client.player.getQueue(interaction.guild.id).setRepeatMode(1);
            break;
        case 'queue':
            interaction.client.player.getQueue(interaction.guild.id).setRepeatMode(2);
            break;
        }

        await interaction.reply(simpleEmbed(`Set repeat mode to \`${mode}\`.`));
    },
};