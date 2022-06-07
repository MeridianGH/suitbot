import { SlashCommandBuilder } from '@discordjs/builders'
import { errorEmbed } from '../../utilities/utilities.js'
import { REST } from '@discordjs/rest'
import { ChannelType, Routes } from 'discord-api-types/v10'
import { MessageEmbed } from 'discord.js'
import { getLanguage } from '../../language/locale.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('activity')
    .setDescription('Creates a Discord activity.')
    .addStringOption((option) => option.setName('activity').setDescription('The activity to create.').setRequired(true).addChoices(
      { name: 'Watch Together', value: '880218394199220334' },
      { name: 'Chess in the Park', value: '832012774040141894' },
      { name: 'Checkers in the Park', value: '832013003968348200' },
      { name: 'Fishington.io', value: '814288819477020702' },
      { name: 'Betrayal.io', value: '773336526917861400' },
      { name: 'Poker Night', value: '755827207812677713' },
      { name: 'Letter Tile', value: '879863686565621790' },
      { name: 'Word Snacks', value: '879863976006127627' },
      { name: 'Doodle Crew', value: '878067389634314250' },
      { name: 'Spellcast', value: '852509694341283871' }
    ))
    .addChannelOption((option) => option.setName('channel').setDescription('The voice channel to create the activity in.').addChannelTypes(ChannelType.GuildVoice).setRequired(true)),
  async execute(interaction) {
    const lang = getLanguage(await interaction.client.database.getLocale(interaction.guildId)).activity
    const channel = interaction.options.getChannel('channel')
    if (!channel.isVoice()) { return await interaction.reply(errorEmbed(lang.errors.voiceChannel, true)) }

    const rest = new REST({ version: '10' }).setToken(interaction.client.token)
    await rest.post(Routes.channelInvites(channel.id), { body: { 'target_application_id': interaction.options.getString('activity'), 'target_type': 2 } })
      .then(async (response) => {
        if (response.error || !response.code) { return interaction.reply(errorEmbed(lang.errors.generic, true)) }
        if (response.code === '50013') { return interaction.reply(errorEmbed(lang.errors.missingPerms, true)) }

        const embed = new MessageEmbed()
          .setAuthor({ name: lang.author, iconURL: interaction.member.user.displayAvatarURL() })
          .setTitle(lang.title)
          .setURL(`https://discord.gg/${response.code}`)
          .setFooter({ text: 'SuitBot', iconURL: interaction.client.user.displayAvatarURL() })

        await interaction.reply({ embeds: [embed] })
      })
  }
}
