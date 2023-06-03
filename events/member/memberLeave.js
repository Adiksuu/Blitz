const { EmbedBuilder, Events } = require('discord.js')
const LobbySchema = require('../schemas/lobbySchema')

module.exports = {
    name: Events.GuildMemberRemove,
    execute: async (member) => {
        const guildId = member.guild.id
        let lobbyData = await LobbySchema.findOne({ guildId: guildId })

        if (!lobbyData) {
            return;
        } 
        if (!lobbyData.lobbyId || !lobbyData.leaveMessage) {
            return;
        }

        const channelEmbed = new EmbedBuilder()
            .setTitle('MEMBER LEAVED')
            .setColor('dde736')
            .setDescription(`${lobbyData.leaveMessage}`)
            .setTimestamp()
            .setFooter({ text: `${member.user.username}#${member.user.discriminator}`, iconURL: member.user.avatarURL({ format: 'png', dynamic: true, size: 128 }) })
    
        await member.guild.channels.cache.get(lobbyData.lobbyId).send({ embeds: [channelEmbed] })
    }
}