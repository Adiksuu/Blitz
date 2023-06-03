const { Events, EmbedBuilder, PermissionsBitField } = require('discord.js')
const AutomodsSchema = require('../schemas/automodSchema')

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {

        if (!message && !message.content) return

        const guildId = message.guild.id
        let automod = await AutomodsSchema.findOne({ guildId: guildId })

        if (!automod || automod.capsEnabled == 'disabled') return

        const userId = message.author.id

        if (message.guild.members.cache.get(userId).permissions.has(PermissionsBitField.Flags.ManageMessages)) return;

        const words = message.content.split(" ");
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            if (word.match(/^[A-Z]{4,}$/)) {
                const replyEmbed = new EmbedBuilder()
                .setColor("dde736")
                .setTitle("CAPSLOCK DETECTED")
                .setDescription(`!Anty-caps! system found excessive use of caps-lock in !your! message\n\nMessage: !${message.content}!`.replace(/!/g, '`'))
                .setTimestamp()

                await message.reply({ embeds: [replyEmbed], ephemeral: true })
                await message.delete()
            }
        }
    }
}