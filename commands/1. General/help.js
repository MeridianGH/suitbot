import { SlashCommandBuilder } from '@discordjs/builders'
import fs from 'fs'
import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Replies with help on how to use this bot.')
    .addStringOption(option => option.setName('category').setDescription('The category to display first.')
      .addChoice('General', '2')
      .addChoice('Music', '3')
      .addChoice('Moderation', '4')
      .addChoice('Feedback', '5')),
  async execute (interaction) {
    const folders = fs.readdirSync('./commands/', { withFileTypes: true }).filter(entry => entry.isDirectory()).map(entry => entry.name)
    const categories = {}
    for (const folder of folders) {
      const commands = []
      for (const file of fs.readdirSync('./commands/' + folder)) {
        commands.push(file)
      }
      categories[folder] = commands
    }

    const pages = []

    const embed = new MessageEmbed()
      .setAuthor({ name: 'Help', iconURL: interaction.member.user.displayAvatarURL() })
      .setTitle('SuitBot Help Page')
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .setDescription('This module lists every command SuitBot currently supports.\n\nTo use a command start by typing `/` followed by the command you want to execute. You can also use Discord\'s integrated auto-completion for commands.\n\n')
      .addField('➕  Invite', '[Click here to invite](https://discord.com/oauth2/authorize?client_id=887122733010411611&scope=bot%20applications.commands&permissions=2167425024)', true)
      .addField('🌐  Website', '[suitbot.xyz](https://suitbot.xyz)', true)
      .addField('\u200b', '\u200b', true)
      .addField('<:github:923336812410306630>  Source code', '[GitHub](https://github.com/MeridianGH/suitbot)', true)
      .addField('<:discord:934041553209548840> Discord Server', '[Invite](https://discord.gg/qX2CBrrUpf)', true)
      .addField('\u200b', '\u200b', true)
      .addField('\u200b', 'Press the buttons below to switch pages and display more info.')
      .setFooter({ text: `SuitBot | Page ${pages.length + 1}/${Object.entries(categories).length + 1}`, iconURL: interaction.client.user.displayAvatarURL() })
    pages.push(embed)

    for (const [category, commands] of Object.entries(categories)) {
      let description = ''
      for (const command of commands) {
        const commandData = (await import(`../${category}/${command}`))
        description = description + `\`${commands.indexOf(command) + 1}.\` **/${commandData.data.name}:** ${commandData.data.description}\n\n`
      }
      description = description + '\u2015'.repeat(34)

      const embed = new MessageEmbed()
        .setAuthor({ name: 'Help', iconURL: interaction.member.user.displayAvatarURL() })
        .setTitle(category)
        .setDescription(description)
        .setFooter({ text: `SuitBot | Page ${pages.length + 1}/${Object.entries(categories).length + 1}`, iconURL: interaction.client.user.displayAvatarURL() })
      pages.push(embed)
    }

    const previous = new MessageButton()
      .setCustomId('previous')
      .setLabel('Previous')
      .setStyle('PRIMARY')
    const next = new MessageButton()
      .setCustomId('next')
      .setLabel('Next')
      .setStyle('PRIMARY')

    let currentIndex = Math.max(Number(interaction.options.getString('category')) - 1, 0)
    const embedMessage = await interaction.reply({ embeds: [pages[currentIndex]], components: [new MessageActionRow({ components: [previous.setDisabled(currentIndex === 0), next.setDisabled(currentIndex === pages.length - 1)] })], fetchReply: true })

    // Collect button interactions (when a user clicks a button)
    const collector = embedMessage.createMessageComponentCollector({ idle: 150000 })
    collector.on('collect', async buttonInteraction => {
      buttonInteraction.customId === 'previous' ? (currentIndex -= 1) : (currentIndex += 1)
      await buttonInteraction.update({ embeds: [pages[currentIndex]], components: [new MessageActionRow({ components: [previous.setDisabled(currentIndex === 0), next.setDisabled(currentIndex === pages.length - 1)] })] })
    })
    collector.on('end', async (collected) => {
      await collected.first()?.message.edit({ embeds: [pages[0]], components: [new MessageActionRow({ components: [previous.setDisabled(true), next.setDisabled(true)] })] })
    })
  }
}
