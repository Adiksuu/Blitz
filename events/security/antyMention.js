const { Events, EmbedBuilder, PermissionsBitField } = require('discord.js')
const AutomodsSchema = require('../schemas/automodSchema')

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {

        if (!message && !message.content) return

        const guildId = message.guild.id
        let automod = await AutomodsSchema.findOne({ guildId: guildId })

        if (!automod || automod.mentionEnabled == 'disabled') return

        const userId = message.author.id

        if (message.guild.members.cache.get(userId).permissions.has(PermissionsBitField.Flags.ManageMessages)) return;

        const mentionedUsersCount = message.mentions.users.size;

        if (mentionedUsersCount >= 2) {
            const replyEmbed = new EmbedBuilder()
            .setColor("dde736")
            .setTitle("MENTION DETECTED")
            .setDescription(`!Anty-mention! system found mention in !your! message\n\nMessage: !${message.content}!`.replace(/!/g, '`'))
            .setTimestamp()

            await message.reply({ embeds: [replyEmbed], ephemeral: true })
            await message.delete()
        }
    }
}