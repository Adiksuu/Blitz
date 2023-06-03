const { Events, EmbedBuilder } = require('discord.js')
const LogsSchema = require('../schemas/logsSchema')

module.exports = {
    name: Events.GuildRoleDelete,
    execute: async (role) => {
        const guildId = role.guild.id
        let logsData = await LogsSchema.findOne({ guildId: guildId })
        const roleInfo = role.guild.roles.cache.get(role.id)

        if (!logsData || logsData.enabled == 'disable' || !logsData.channelId) return;

        const channelEmbed = new EmbedBuilder()
            .setTitle('ROLE DELETED')
            .setColor('dde736')
            .setDescription(`Role has been !deleted!\n\n**INFO:**\nRole name: !${role.name}!`.replace(/!/g, '`'))
    
        role.guild.channels.cache.get(logsData.channelId).send({ embeds: [channelEmbed] })
    }
}