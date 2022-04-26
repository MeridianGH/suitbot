import { SlashCommandBuilder } from '@discordjs/builders'
import { errorEmbed, simpleEmbed } from '../../utilities/utilities.js'
import discordRest from '@discordjs/rest'
import { ChannelType, Routes } from 'discord-api-types/v9'
import { MessageEmbed } from 'discord.js'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('activity')
    .setDescription('Creates a Discord activity.')
    .addStringOption((option) => option.setName('activity').setDescription('The activity to create.').setRequired(true).addChoices([
      ['Watch Together', '880218394199220334'],
      ['Chess in the Park', '832012774040141894'],
      ['Checkers in the Park', '832013003968348200'],
      ['Fishington.io', '814288819477020702'],
      ['Betrayal.io', '773336526917861400'],
      ['Poker Night', '755827207812677713'],
      ['Letter Tile', '879863686565621790'],
      ['Word Snacks', '879863976006127627'],
      ['Doodle Crew', '878067389634314250'],
      ['Spellcast', '852509694341283871']
    ]))
    .addChannelOption((option) => option.setName('channel').setDescription('The voice channel to create the activity in.').addChannelType(ChannelType.GuildVoice).setRequired(true)),
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel')
    if (!channel.isVoice()) { return await interaction.reply(simpleEmbed('You can only specify a voice channel!', true)) }

    const rest = new discordRest.REST({ version: '9' }).setToken(interaction.client.token)
    await rest.post(Routes.channelInvites(channel.id), { body: { 'target_application_id': interaction.options.getString('activity'), 'target_type': 2 } })
      .then(async (response) => {
        if (response.error || !response.code) { return interaction.reply(errorEmbed('Error', 'An error occurred while creating your activity!', true)) }
        if (response.code === '50013') { return interaction.reply(simpleEmbed('The bot is missing permissions to perform that action.', true)) }

        const embed = new MessageEmbed()
          .setAuthor({ name: 'Activity', iconURL: interaction.member.user.displayAvatarURL() })
          .setTitle('Click here to open Activity')
          .setURL(`https://discord.gg/${response.code}`)
          .setFooter({ text: 'SuitBot', iconURL: interaction.client.user.displayAvatarURL() })

        await interaction.reply({ embeds: [embed] })
      })
  }
}
