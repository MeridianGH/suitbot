import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import fs from 'fs'
import { getLanguage } from '../../language/locale.js'
import { logging } from '../../utilities/logging.js'

const categories = ['general', 'music', 'moderation', 'feedback']

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Replies with help on how to use this bot.')
    .addStringOption((option) => option.setName('category').setDescription('The category to display first.').addChoices(
      { name: 'General', value: '1' },
      { name: 'Music', value: '2' },
      { name: 'Moderation', value: '3' },
      { name: 'Feedback', value: '4' }
    )),
  async execute(interaction) {
    const lang = getLanguage(await interaction.client.database.getLocale(interaction.guildId)).help

    const pages = []

    const embed = new EmbedBuilder()
      .setAuthor({ name: lang.author, iconURL: interaction.member.user.displayAvatarURL() })
      .setTitle(lang.title)
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .setDescription(lang.description)
      .addFields([
        { name: '➕ ' + lang.fields.invite.name, value: `[${lang.fields.invite.value}](https://discord.com/oauth2/authorize?client_id=887122733010411611&scope=bot%20applications.commands&permissions=2167425024)`, inline: true },
        { name: '🌐 ' + lang.fields.website.name, value: `[${interaction.client.dashboard.host.replace(/^https?:\/\//, '')}](${interaction.client.dashboard.host})`, inline: true },
        { name: '\u200b', value: '\u200b', inline: true },
        { name: '<:github:923336812410306630> ' + lang.fields.github.name, value: `[${lang.fields.github.value}](https://github.com/MeridianGH/suitbot)`, inline: true },
        { name: '<:discord:934041553209548840> ' + lang.fields.discord.name, value: `[${lang.fields.discord.value}](https://discord.gg/qX2CBrrUpf)`, inline: true },
        { name: '\u200b', value: '\u200b', inline: true },
        { name: '\u200b', value: lang.fields.buttons.value + '\nChange language with `/language`.', inline: false }
      ])
      .setFooter({ text: `SuitBot | ${lang.other.page} ${pages.length + 1}/${categories.length + 1}`, iconURL: interaction.client.user.displayAvatarURL() })
    pages.push(embed)

    for (const category of categories) {
      let description = ''
      const commands = fs.readdirSync('./commands/' + category)
      for (const command of commands) {
        const commandData = await import(`../${category}/${command}`)
        description = description + `\`${commands.indexOf(command) + 1}.\` **/${commandData.data.name}:** ${commandData.data.description}\n\n`
      }
      description = description + '\u2015'.repeat(34)

      const embed = new EmbedBuilder()
        .setAuthor({ name: lang.author, iconURL: interaction.member.user.displayAvatarURL() })
        .setTitle(`${categories.indexOf(category) + 1}. ${category.replace(/(^[a-z])/i, (str, first) => first.toUpperCase() )}`)
        .setDescription(description)
        .setFooter({ text: `SuitBot | ${lang.other.page} ${pages.length + 1}/${categories.length + 1}`, iconURL: interaction.client.user.displayAvatarURL() })
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

    let currentIndex = Math.max(Number(interaction.options.getString('category')), 0)
    const message = await interaction.reply({ embeds: [pages[currentIndex]], components: [new ActionRowBuilder().setComponents([previous.setDisabled(currentIndex === 0), next.setDisabled(currentIndex === pages.length - 1)])], fetchReply: true })

    // Collect button interactions (when a user clicks a button)
    const collector = message.createMessageComponentCollector({ idle: 300000 })
    collector.on('collect', async (buttonInteraction) => {
      buttonInteraction.customId === 'previous' ? currentIndex -= 1 : currentIndex += 1
      await buttonInteraction.update({ embeds: [pages[currentIndex]], components: [new ActionRowBuilder().setComponents([previous.setDisabled(currentIndex === 0), next.setDisabled(currentIndex === pages.length - 1)])] })
    })
    collector.on('end', async () => {
      const fetchedMessage = await message.fetch(true).catch((e) => { logging.warn(`Failed to edit message components: ${e}`) })
      await fetchedMessage?.edit({ components: [new ActionRowBuilder().setComponents(fetchedMessage.components[0].components.map((component) => ButtonBuilder.from(component.toJSON()).setDisabled(true)))] })
    })
  }
}
