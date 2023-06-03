const { Events, EmbedBuilder, PermissionsBitField } = require('discord.js')
const AutomodsSchema = require('../schemas/automodSchema')

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {

        if (!message && !message.content) return

        const guildId = message.guild.id
        let automod = await AutomodsSchema.findOne({ guildId: guildId })

        if (!automod || automod.swearEnabled == 'disabled') return

        const userId = message.author.id

        if (message.guild.members.cache.get(userId).permissions.has(PermissionsBitField.Flags.ManageMessages)) return;

        const swears = [
            {
                'swear': 'fuck'
            },
            {
                'swear': 'shit'
            },
            {
                'swear': 'ass'
            },
            {
                'swear': 'bitch'
            },
            {
                'swear': 'nigga'
            },
            {
                'swear': 'nigge'
            },
            {
                'swear': 'cock'
            },
            {
                'swear': 'damn'
            },
            {
                'swear': 'dick'
            },
            {
                'swear': 'slut'
            },
        ]

        for (let i = 0; i < swears.length; i++) {
            if (message.content.toLowerCase().includes(swears[i].swear)) {
                const replyEmbed = new EmbedBuilder()
                .setColor("dde736")
                .setTitle("SWEAR DETECTED")
                .setDescription(`!Anty-swear! system found swear in !your! message\n\nMessage: !${message.content}!`.replace(/!/g, '`'))
                .setTimestamp()

                await message.reply({ embeds: [replyEmbed], ephemeral: true })
                await message.delete()
            }
        }
    }
}