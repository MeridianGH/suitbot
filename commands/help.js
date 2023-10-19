import {EmbedBuilder, SlashCommandBuilder} from "discord.js";

export const { data, execute } = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Replies with help on how to use this bot.'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setAuthor({ name: 'The future of SuitBot.', iconURL: interaction.member.user.displayAvatarURL() })
            .setTitle('SuitBot will be shutting down shortly.')
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .setDescription('Due to various circumstances and stagnant development SuitBot will be shutting down shortly.\n' +
                'The website has been offline for a few weeks and will not come back and all commands have been deactivated.\n\n' +
                'In the meantime I have been working on a new Discord bot focused on bringing music to your channels.\n\n' +
                'The new bot (called Kalliope) took over and improved on the music features of SuitBot, especially the web interface.\n' +
                'While the era of SuitBot may be over, Kalliope will continue its legacy...'
            )
            .addFields([{ name: '\u200b', value: '[Check out kalliope.cc](https://kalliope.cc)' }])
            .setFooter({ text: 'SuitBot', iconURL: interaction.client.user.displayAvatarURL() })
        await interaction.reply({ embeds: [embed] })
    }
}
