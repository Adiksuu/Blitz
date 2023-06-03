const { Events, EmbedBuilder, PermissionsBitField } = require('discord.js')
const emojiRegex = require("emoji-regex");
const AutomodsSchema = require('../schemas/automodSchema')

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {

        if (!message && !message.content) return

        const guildId = message.guild.id
        let automod = await AutomodsSchema.findOne({ guildId: guildId })

        if (!automod || automod.emojiEnabled == 'disabled') return

        const userId = message.author.id

        if (message.guild.members.cache.get(userId).permissions.has(PermissionsBitField.Flags.ManageMessages)) return;

        const emojiRegexPattern = emojiRegex();
        const emojiMatches = message.content.match(emojiRegexPattern) || [];
        const emojiCount = emojiMatches.length;
        if (emojiCount >= 3) {
            const replyEmbed = new EmbedBuilder()
            .setColor("dde736")
            .setTitle("EMOJI DETECTED")
            .setDescription(`!Anty-emoji! system found excessive use of emojis in !your! message\n\nMessage: !${message.content}!`.replace(/!/g, '`'))
            .setTimestamp()

            await message.reply({ embeds: [replyEmbed], ephemeral: true })
            await message.delete()
        }
    }
}