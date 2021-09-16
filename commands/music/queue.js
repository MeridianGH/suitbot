const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { simpleEmbed } = require('../../utilities');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Displays the queue.'),
    async execute(interaction) {
        const queue = interaction.client.player.getQueue(interaction.guild.id);
        if (!queue) { return interaction.reply(simpleEmbed('Nothing currently playing.\nStart playback with /play!')); }

        const pages = [];
        const embed = new MessageEmbed()
            .setAuthor('Queue.', `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}`)
            .setFooter('SuitBot', 'https://cdn.discordapp.com/app-icons/887122733010411611/78c68033a9da502750c5165029b57817.png')
            .addField('Now Playing:', `[${queue.nowPlaying.name}](${queue.nowPlaying.url}) | \`${queue.nowPlaying.duration} Requested by: ${queue.nowPlaying.requestedBy}\`\n\u200b`);

        if (queue.songs.length === 1) {
            // Format single page with no upcoming songs.
            embed.addField('No upcoming songs.', 'Add songs with /play!');

            pages.push(embed);
        } else if (queue.songs.length > 1 && queue.songs.length <= 11) {
            // Format single page.
            const songs1 = queue.songs.slice(1, 6);
            const songs2 = queue.songs.slice(6, 11);
            let field1 = '';
            let field2 = '';

            songs1.forEach(song => {
                field1 = field1 + `\`${queue.songs.indexOf(song)}.\` [${song.name}](${song.url}) | \`${song.duration} Requested by: ${song.requestedBy}\`\n\n`;
            });
            songs2.forEach(song => {
                field2 = field2 + `\`${queue.songs.indexOf(song)}.\` [${song.name}](${song.url}) | \`${song.duration} Requested by: ${song.requestedBy}\`\n\n`;
            });

            embed.addField('Up next:', field1);
            if (!(field2 === '')) {
                embed.addField('\u200b', field2);
            }

            pages.push(embed);
        } else {
            // Format all pages.
            for (let i = 1; i < queue.songs.length - 1; i += 10) {
                const songs = queue.songs.slice(i, i + 10);

                const songs1 = songs.slice(0, 5);
                const songs2 = songs.slice(5, 10);
                let field1 = '';
                let field2 = '';

                const pageEmbed = new MessageEmbed()
                    .setAuthor('Queue.', `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}`)
                    .setFooter(`Page ${pages.length + 1}/${Math.ceil(queue.songs.length / 10)} | Loop: ${queue.repeatMode === 1 ? '✅' : '❌'} | Queue Loop: ${queue.repeatMode === 2 ? '✅' : '❌'}`, 'https://cdn.discordapp.com/app-icons/887122733010411611/78c68033a9da502750c5165029b57817.png')
                    .addField('Now Playing:', `[${queue.nowPlaying.name}](${queue.nowPlaying.url}) | \`${queue.nowPlaying.duration} Requested by: ${queue.nowPlaying.requestedBy}\`\n\u200b`);

                songs1.forEach(song => {
                    field1 = field1 + `\`${queue.songs.indexOf(song)}.\` [${song.name}](${song.url}) | \`${song.duration} Requested by: ${song.requestedBy}\`\n\n`;
                });
                songs2.forEach(song => {
                    field2 = field2 + `\`${queue.songs.indexOf(song)}.\` [${song.name}](${song.url}) | \`${song.duration} Requested by: ${song.requestedBy}\`\n\n`;
                });

                pageEmbed.addField('Up next:', field1);
                if (!(field2 === '')) {
                    pageEmbed.addField('\u200b', field2);
                }
                pages.push(pageEmbed);
            }
        }

        const isOnePage = pages.length === 1;

        const previous = new MessageButton()
            .setCustomId('previous')
            .setLabel('Previous')
            .setStyle('PRIMARY');
        const next = new MessageButton()
            .setCustomId('next')
            .setLabel('Next')
            .setStyle('PRIMARY');

        await interaction.reply('\u2060');
        const embedMessage = await interaction.channel.send({embeds: [pages[0]], components: isOnePage ? [] : [new MessageActionRow({components: [previous.setDisabled(true), next.setDisabled(false)]})]});

        // Collect button interactions (when a user clicks a button),
        // but only when the button as clicked by the original message author
        const collector = embedMessage.createMessageComponentCollector({
            filter: ({user}) => user.id === interaction.member.id,
        });

        let currentIndex = 0;
        collector.on('collect', async buttonInteraction => {
            // Increase/decrease index
            buttonInteraction.customId === 'previous' ? (currentIndex -= 1) : (currentIndex += 1);
            // Respond to interaction by updating message with new embed
            if (currentIndex === 0) {
                await buttonInteraction.update({embeds: [pages[currentIndex]], components: [new MessageActionRow({components: [previous.setDisabled(true), next.setDisabled(false)]})]});
            } else if (currentIndex === pages.length - 1) {
                await buttonInteraction.update({embeds: [pages[currentIndex]], components: [new MessageActionRow({components: [previous.setDisabled(false), next.setDisabled(true)]})]});
            } else {
                await buttonInteraction.update({embeds: [pages[currentIndex]], components: [new MessageActionRow({components: [previous.setDisabled(false), next.setDisabled(false)]})]});
            }
        });
    },
};