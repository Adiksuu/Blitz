const { Events, EmbedBuilder } = require('discord.js')
const LogsSchema = require('../schemas/logsSchema')

module.exports = {
    name: Events.ChannelCreate,
    execute: async (channel) => {
        const guildId = channel.guild.id
        let logsData = await LogsSchema.findOne({ guildId: guildId })
        const channelInfo = channel.guild.channels.cache.get(channel.id)

        if (!logsData || logsData.enabled == 'disable' || !logsData.channelId) return;

        const channelEmbed = new EmbedBuilder()
            .setTitle('CHANNEL CREATED')
            .setColor('dde736')
            .setDescription(`Channel has been !created!\n\n**INFO:**\nChannel: ${channelInfo}\nChannel name: !${channelInfo.name}!\nChannel category: !${channel.guild.channels.cache.get(channelInfo.parentId).name}!`.replace(/!/g, '`'))
    
        channel.guild.channels.cache.get(logsData.channelId).send({ embeds: [channelEmbed] })
    }
}