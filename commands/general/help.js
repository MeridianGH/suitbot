const { SlashCommandBuilder } = require('@discordjs/builders')
const fs = require('fs')
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Replies with help on how to use this bot.')
    .addStringOption(option =>
      option.setName('category')
        .setDescription('The category to display first.')
        .addChoices([
          ['General', 'general'],
          ['Moderation', 'moderation'],
          ['Music', 'music']
        ])),
  async execute (interaction) {
    const folders = fs.readdirSync('./commands/').filter(function (file) { return fs.statSync('./commands/' + file).isDirectory() })
    const categories = {}
    for (const folder of folders) {
      const commands = []
      for (const file of fs.readdirSync('./commands/' + folder)) {
        commands.push(file)
      }
      categories[folder] = commands
    }

    const pages = []

    for (const [category, commands] of Object.entries(categories)) {
      let description = ''
      for (const command of commands) {
        const commandData = require(`../${category}/${command}`)
        description = description + `\`${commands.indexOf(command) + 1}.\` **/${commandData.data.name}:** ${commandData.data.description}\n\n`
      }
      description = description + '\u2015'.repeat(34)

      const embed = new MessageEmbed()
        .setAuthor('Help', interaction.member.user.displayAvatarURL())
        .setTitle(category[0].toUpperCase() + category.substring(1) + '.')
        .setDescription(description)
        .setFooter(`SuitBot | Page ${pages.length + 1}/${Object.entries(categories).length}`, interaction.client.user.displayAvatarURL())
      pages.push(embed)
    }

    const previous = new MessageButton()
      .setCustomId('previousHelp')
      .setLabel('Previous')
      .setStyle('PRIMARY')
    const next = new MessageButton()
      .setCustomId('nextHelp')
      .setLabel('Next')
      .setStyle('PRIMARY')

    let currentIndex = Object.keys(categories).indexOf(interaction.options.getString('category'))
    const embedMessage = await interaction.reply({ embeds: [pages[currentIndex]], components: [new MessageActionRow({ components: [previous.setDisabled(currentIndex === 0), next.setDisabled(currentIndex === pages.length - 1)] })], fetchReply: true })

    // Collect button interactions (when a user clicks a button)
    const collector = embedMessage.createMessageComponentCollector()
    collector.on('collect', async buttonInteraction => {
      buttonInteraction.customId === 'previousHelp' ? (currentIndex -= 1) : (currentIndex += 1)
      await buttonInteraction.update({ embeds: [pages[currentIndex]], components: [new MessageActionRow({ components: [previous.setDisabled(currentIndex === 0), next.setDisabled(currentIndex === pages.length - 1)] })] })
    }
    )
  }
}
