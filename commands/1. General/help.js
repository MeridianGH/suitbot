import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import fs from 'fs'
import { getLanguage } from '../../language/locale.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Replies with help on how to use this bot.')
    .addStringOption((option) => option.setName('category').setDescription('The category to display first.').addChoices(
      { name: 'General', value: '2' },
      { name: 'Music', value: '3' },
      { name: 'Moderation', value: '4' },
      { name: 'Feedback', value: '5' }
    )),
  async execute(interaction) {
    const lang = getLanguage(await interaction.client.database.getLocale(interaction.guildId)).help
    const folders = fs.readdirSync('./commands/', { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name)
    const categories = {}
    for (const folder of folders) {
      const commands = []
      for (const file of fs.readdirSync('./commands/' + folder)) {
        commands.push(file)
      }
      categories[folder] = commands
    }

    const pages = []

    const embed = new EmbedBuilder()
      .setAuthor({ name: lang.author, iconURL: interaction.member.user.displayAvatarURL() })
      .setTitle(lang.title)
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .setDescription(lang.description)
      .setFooter({ text: `SuitBot | ${lang.other.page} ${pages.length + 1}/${Object.entries(categories).length + 1}`, iconURL: interaction.client.user.displayAvatarURL() })
      .addFields([
        { name: '➕ ' + lang.fields.invite.name, value: `[${lang.fields.invite.value}](https://discord.com/oauth2/authorize?client_id=887122733010411611&scope=bot%20applications.commands&permissions=2167425024)`, inline: true },
        { name: '🌐 ' + lang.fields.website.name, value: '[suitbot.xyz](https://suitbot.xyz)', inline: true },
        { name: '\u200b', value: '\u200b', inline: true },
        { name: '<:github:923336812410306630> ' + lang.fields.github.name, value: `[${lang.fields.github.value}](https://github.com/MeridianGH/suitbot)`, inline: true },
        { name: '<:discord:934041553209548840> ' + lang.fields.discord.name, value: `[${lang.fields.discord.value}](https://discord.gg/qX2CBrrUpf)`, inline: true },
        { name: '\u200b', value: '\u200b', inline: true },
        { name: '\u200b', value: lang.fields.buttons.value + '\nChange language with `/language`.', inline: false }
      ])
    pages.push(embed)

    for (const [category, commands] of Object.entries(categories)) {
      let description = ''
      for (const command of commands) {
        const commandData = await import(`../${category}/${command}`)
        description = description + `\`${commands.indexOf(command) + 1}.\` **/${commandData.data.name}:** ${commandData.data.description}\n\n`
      }
      description = description + '\u2015'.repeat(34)

      const embed = new EmbedBuilder()
        .setAuthor({ name: lang.author, iconURL: interaction.member.user.displayAvatarURL() })
        .setTitle(category)
        .setDescription(description)
        .setFooter({ text: `SuitBot | ${lang.other.page} ${pages.length + 1}/${Object.entries(categories).length + 1}`, iconURL: interaction.client.user.displayAvatarURL() })
      pages.push(embed)
    }

    const previous = new ButtonBuilder()
      .setCustomId('previous')
      .setLabel(lang.other.previous)
      .setStyle(ButtonStyle.Primary)
    const next = new ButtonBuilder()
      .setCustomId('next')
      .setLabel(lang.other.next)
      .setStyle(ButtonStyle.Primary)

    let currentIndex = Math.max(Number(interaction.options.getString('category')) - 1, 0)
    const embedMessage = await interaction.reply({ embeds: [pages[currentIndex]], components: [new ActionRowBuilder().setComponents([previous.setDisabled(currentIndex === 0), next.setDisabled(currentIndex === pages.length - 1)])], fetchReply: true })

    // Collect button interactions (when a user clicks a button)
    const collector = embedMessage.createMessageComponentCollector({ idle: 150000 })
    collector.on('collect', async (buttonInteraction) => {
      buttonInteraction.customId === 'previous' ? currentIndex -= 1 : currentIndex += 1
      await buttonInteraction.update({ embeds: [pages[currentIndex]], components: [new ActionRowBuilder().setComponents([previous.setDisabled(currentIndex === 0), next.setDisabled(currentIndex === pages.length - 1)])] })
    })
    collector.on('end', async (collected) => {
      await collected.first()?.message.edit({ embeds: [pages[0]], components: [new ActionRowBuilder().setComponents([previous.setDisabled(true), next.setDisabled(true)])] })
    })
  }
}
