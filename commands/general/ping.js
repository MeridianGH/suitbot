const { SlashCommandBuilder } = require('@discordjs/builders');
const { simpleEmbed } = require('../../utilities');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with the current latency.'),
    async execute(interaction) {
        await interaction.channel.send('Pinging...').then(async (m) => {
            m.delete();
            const ping = m.createdTimestamp - interaction.createdTimestamp;
            await interaction.reply(simpleEmbed(`Ping: ${ping}ms | API Latency: ${Math.round(interaction.client.ws.ping)}ms`));
        });
    },
};
