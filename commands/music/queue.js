const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Displays the queue.'),
    async execute(interaction) {
        const queue = interaction.client.player.getQueue(interaction.guild.id);
        const songs = queue.songs;

        const embed = new MessageEmbed()
            .setAuthor('Queue.', `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}`)
            .setFooter('SuitBot', 'https://cdn.discordapp.com/app-icons/887122733010411611/78c68033a9da502750c5165029b57817.png');

        songs.forEach(song => {
            embed.addField(song.name, song.author);
            embed.addField(`Duration: ${song.duration}`, `Position: ${songs.indexOf(song) + 1}`, true);
        });

        interaction.reply({embeds: [embed]});
    },
};