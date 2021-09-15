const { SlashCommandBuilder } = require('@discordjs/builders');
const { simpleEmbed } = require('../../utilities');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Replies with info about you.'),
    async execute(interaction) {
        await interaction.reply(simpleEmbed(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`));
    },
};
