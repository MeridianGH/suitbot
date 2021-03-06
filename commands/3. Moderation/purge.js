import { SlashCommandBuilder } from '@discordjs/builders'
import { errorEmbed, simpleEmbed } from '../../utilities/utilities.js'
import { Permissions } from 'discord.js'
import { getLanguage } from '../../language/locale.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Clears a specified amount of messages.')
    .addIntegerOption((option) => option.setName('amount').setDescription('The amount of messages to clear.').setRequired(true)),
  async execute(interaction) {
    const lang = getLanguage(await interaction.client.database.getLocale(interaction.guildId)).purge
    let amount = interaction.options.getInteger('amount')
    amount = amount.toString()

    if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) { return await interaction.reply(errorEmbed(lang.errors.userMissingPerms, true)) }
    if (!interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) { return await interaction.reply(errorEmbed(lang.errors.missingPerms, true)) }
    if (amount < 1 || amount > 100) { return await interaction.reply(errorEmbed(lang.errors.index, true)) }

    await interaction.channel.messages.fetch({ limit: amount }).then((messages) => {
      interaction.channel.bulkDelete(messages)
    })
    await interaction.reply(simpleEmbed(lang.other.response(amount), true))
  }
}
