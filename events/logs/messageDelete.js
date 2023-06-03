const { Events, EmbedBuilder } = require('discord.js')
const LogsSchema = require('../schemas/logsSchema')

module.exports = {
    name: Events.MessageDelete,
    execute: async (message) => {
        const guildId = message.guild.id
        let logsData = await LogsSchema.findOne({ guildId: guildId })

        if (!logsData || logsData.enabled == 'disable' || !logsData.channelId) return;

        if (!message.embeds[0]) {
            const channelEmbed = new EmbedBuilder()
                .setTitle('MESSAGE DELETED')
                .setColor('dde736')
                .setDescription(`Message has been !deleted!\n\n**INFO:**\nAuthor: !${message.author.username}#${message.author.discriminator}!\nMessage content: !${message.content}!\nChannel: ${message.channel}`.replace(/!/g, '`'))
        
            message.guild.channels.cache.get(logsData.channelId).send({ embeds: [channelEmbed] })
        } else {
            const channelEmbed = new EmbedBuilder()
                .setTitle('MESSAGE DELETED')
                .setColor('dde736')
                .setDescription(`Message has been !deleted!\n\n**INFO:**\nAuthor: !${message.author.username}#${message.author.discriminator}!\nMessage content: !Message is embed!\nChannel: ${message.channel}`.replace(/!/g, '`'))
        
            message.guild.channels.cache.get(logsData.channelId).send({ embeds: [channelEmbed] })
        }
    }
}