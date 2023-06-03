const { Events, EmbedBuilder } = require('discord.js')
const LogsSchema = require('../schemas/logsSchema')

module.exports = {
    name: Events.ChannelDelete,
    execute: async (channel) => {
        const guildId = channel.guild.id
        let logsData = await LogsSchema.findOne({ guildId: guildId })

        if (!logsData || logsData.enabled == 'disable' || !logsData.channelId) return;

        const channelEmbed = new EmbedBuilder()
            .setTitle('CHANNEL DELETED')
            .setColor('dde736')
            .setDescription(`Channel has been !deleted!\n\n**INFO:**\nChannel name: !${channel.name}!\nChannel category: !${channel.guild.channels.cache.get(channel.parentId).name}!`.replace(/!/g, '`'))
    
        channel.guild.channels.cache.get(logsData.channelId).send({ embeds: [channelEmbed] })
    }
}