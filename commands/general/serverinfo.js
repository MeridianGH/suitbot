const { SlashCommandBuilder } = require('@discordjs/builders');
const { simpleEmbed } = require('../../utilities');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Replies with info about this server.'),
    async execute(interaction) {
        await interaction.reply(simpleEmbed(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}\nCreated: ${interaction.guild.createdAt}`));
    },
};
