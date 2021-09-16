const { SlashCommandBuilder } = require('@discordjs/builders');
const { simpleEmbed } = require('../../utilities');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('github')
        .setDescription('Sends a link to the repo of this bot.'),
    async execute(interaction) {
        await interaction.reply(simpleEmbed('[GitHub](https://github.com/MeridianGH/suitbot)'));
    },
};
