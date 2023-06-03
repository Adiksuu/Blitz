const { EmbedBuilder, Events } = require('discord.js');
const LobbySchema = require('../schemas/lobbySchema');

module.exports = {
    name: Events.GuildMemberAdd,
    execute: async (member) => {
        const guildId = member.guild.id;
        let lobbyData = await LobbySchema.findOne({ guildId: guildId });

        if (!lobbyData) {
            return;
        } 
        if (!lobbyData.lobbyId || !lobbyData.joinMessage) {
            return;
        }

        const channelEmbed = new EmbedBuilder()
            .setTitle('MEMBER JOINED')
            .setColor('dde736')
            .setDescription(`${lobbyData.joinMessage}`)
            .setTimestamp()
            .setFooter({ text: `${member.user.username}#${member.user.discriminator}`, iconURL: member.user.avatarURL({ format: 'png', dynamic: true, size: 128 }) });

        await member.guild.channels.cache.get(lobbyData.lobbyId).send({ embeds: [channelEmbed] });

        if (!lobbyData.roleId) return

        const role = member.guild.roles.cache.get(lobbyData.roleId)
        member.roles.add(role)
    }
};
