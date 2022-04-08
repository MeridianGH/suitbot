import { SlashCommandBuilder } from '@discordjs/builders'
import { simpleEmbed } from '../../utilities.js'
import { MessageEmbed, Permissions } from 'discord.js'
import { ChannelType } from 'discord-api-types/v9'

export const { data, execute } = {
  data: new SlashCommandBuilder()
    .setName('moveall')
    .setDescription('Moves all users from the first channel to the second channel.')
    .addChannelOption(option => option.setName('channel1').setDescription('The channel to move from.').addChannelType(ChannelType.GuildVoice).setRequired(true))
    .addChannelOption(option => option.setName('channel2').setDescription('The channel to move to.').addChannelType(ChannelType.GuildVoice).setRequired(true)),
  async execute (interaction) {
    const channel1 = interaction.options.getChannel('channel1')
    const channel2 = interaction.options.getChannel('channel2')

    if (!interaction.member.permissions.has(Permissions.FLAGS.MOVE_MEMBERS)) { return await interaction.reply(simpleEmbed('You do not have permission to execute this command!', true)) }
    if (!interaction.guild.me.permissions.has(Permissions.FLAGS.MOVE_MEMBERS)) { return await interaction.reply(simpleEmbed('The bot is missing permissions to move users!', true)) }

    for (const user of channel1.members) {
      await user[1].voice.setChannel(channel2)
    }

    const embed = new MessageEmbed()
      .setAuthor({ name: 'Moved All Users', iconURL: interaction.member.user.displayAvatarURL() })
      .setTitle(`${channel1.name} → ${channel2.name}`)
      .setThumbnail(interaction.guild.iconURL())
      .setDescription(`Moved all users from \`${channel1.name}\` to \`${channel2.name}\`.`)
      .setFooter({ text: 'SuitBot', iconURL: interaction.client.user.displayAvatarURL() })

    await interaction.reply({ embeds: [embed] })
  }
}
