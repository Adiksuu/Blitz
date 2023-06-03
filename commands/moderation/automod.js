const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js')
const AutomodsSchema = require('../../events/schemas/automodSchema')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('automod')
        .setDescription('Manage automod')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addSubcommand(subcommand => 
            subcommand
                .setName('info')
                .setDescription('Get info about automod')
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName('enabled')
                .setDescription('Manage activation status of automod')
                .addStringOption(option => option.setName('feature').setDescription('Select feature to manage').addChoices({name: 'anty link', value: 'link'},{name: 'anty mention', value: 'mention'},{name: 'anty emoji', value: 'emoji'},{name: 'anty caps', value: 'caps'},{name: 'anty swear', value: 'swear'}).setRequired(true))
                .addStringOption(option => option.setName('enable').setDescription('Enable/Disable automod features').addChoices({name: 'Enable feature', value: 'enabled'}, {name: 'Disable feature', value: 'disabled'}).setRequired(true))
        ),
    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'info') {
            const guildId = interaction.guild.id
            let automod = await AutomodsSchema.findOne({ guildId: guildId })

            if (!automod) {

                automod = await AutomodsSchema.create({
                    guildId: guildId,
                    linkEnabled: 'disabled',
                    mentionEnabled: 'disabled',
                    emojiEnabled: 'disabled',
                    capsEnabled: 'disabled',
                    swearEnabled: 'disabled'
                })

                const replyEmbed = new EmbedBuilder()
                .setTitle('AUTO-MOD INFO')
                .setColor('dde736')
                .setDescription(`Manage !automod!\n\n**ANTY-LINK:**\n%%%disabled%%%\n**ANTY-MENTION:**\n%%%disabled%%%\n**ANTY-EMOJI:**\n%%%disabled%%%\n**ANTY-CAPS:**\n%%%disabled%%%\n**ANTY-SWEAR:**\n%%%disabled%%%`.replace(/%%%/g, '```').replace(/!/g, '`'))
        
                await interaction.reply({ embeds: [replyEmbed], ephemeral: true })

                await automod.save()
            } else {
                const replyEmbed = new EmbedBuilder()
                .setTitle('AUTO-MOD INFO')
                .setColor('dde736')
                .setDescription(`Manage !automod!\n\n**ANTY-LINK:**\n%%%${automod.linkEnabled}%%%\n**ANTY-MENTION:**\n%%%${automod.mentionEnabled}%%%\n**ANTY-EMOJI:**\n%%%${automod.emojiEnabled}%%%\n**ANTY-CAPS:**\n%%%${automod.capsEnabled}%%%\n**ANTY-SWEAR:**\n%%%${automod.swearEnabled}%%%`.replace(/%%%/g, '```').replace(/!/g, '`'))
        
                await interaction.reply({ embeds: [replyEmbed], ephemeral: true })
            }
        }
        else if (interaction.options.getSubcommand() === 'enabled') {
            const guildId = interaction.guild.id
            let automod = await AutomodsSchema.findOne({ guildId: guildId })

            const feature = interaction.options.getString('feature')
            const status = interaction.options.getString('enable')

            if (!automod) return

            const replyEmbed = new EmbedBuilder()
                .setTitle('AUTO-MOD UPDATED')
                .setColor('dde736')
                .setDescription(`Auto mod has been !updated!\n\nFeature: !anty-${feature}!\nStatus: !${status}!\nChanged by: !${interaction.user.username}#${interaction.user.discriminator}!`.replace(/!/g, '`'))
        
            await interaction.reply({ embeds: [replyEmbed], ephemeral: true })

            if (feature == 'link') {
                automod.linkEnabled = status
            }
            if (feature == 'mention') {
                automod.mentionEnabled = status
            }
            if (feature == 'emoji') {
                automod.emojiEnabled = status
            }
            if (feature == 'caps') {
                automod.capsEnabled = status
            }
            if (feature == 'swear') {
                automod.swearEnabled = status
            }

            await automod.save()
        }
    }
}