const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js')
const LogsSchema = require('../../events/schemas/logsSchema')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('logs')
        .setDescription('Manage logs')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addSubcommand(subcommand =>
            subcommand
                .setName('info')
                .setDescription('Get info about logs')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('channel')
                .setDescription('Manage logs channel')
                .addChannelOption(option => option.setName('channel').setDescription('Set logs channel').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('enabled')
                .setDescription('Manage activation status of logs')
                .addStringOption(option => option.setName('enable').setDescription('Enable/Disable logs').addChoices({name: 'Enable logs', value: 'enable'}, {name: 'Disable logs', value: 'disable'}).setRequired(true))
        ),
    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'info') {
            const guildId = interaction.guild.id
            let logsData = await LogsSchema.findOne({ guildId: guildId })

            if (!logsData) {
                const replyEmbed = new EmbedBuilder()
                    .setTitle('LOGS INFO')
                    .setColor('dde736')
                    .setDescription(`Get !info! about logs\n\nChannel: !not set!\nEnabled: !off!`.replace(/!/g, '`'))

                interaction.reply({ embeds: [replyEmbed], ephemeral: true })
            } else {
                if (logsData.channelId && !logsData.enabled) {
                    const replyEmbed = new EmbedBuilder()
                    .setTitle('LOGS INFO')
                    .setColor('dde736')
                    .setDescription(`Get !info! about logs\n\nChannel: !${interaction.guild.channels.cache.get(logsData.channelId).name}!\nEnabled: !not set!`.replace(/!/g, '`'))

                    interaction.reply({ embeds: [replyEmbed], ephemeral: true })
                } else if (!logsData.channelId && !logsData.enabled){
                    const replyEmbed = new EmbedBuilder()
                    .setTitle('LOGS INFO')
                    .setColor('dde736')
                    .setDescription(`Get !info! about logs\n\nChannel: !not set!\nEnabled: !not set!`.replace(/!/g, '`'))

                    interaction.reply({ embeds: [replyEmbed], ephemeral: true })
                } else if (!logsData.channelId && logsData.enabled){
                    const replyEmbed = new EmbedBuilder()
                    .setTitle('LOGS INFO')
                    .setColor('dde736')
                    .setDescription(`Get !info! about logs\n\nChannel: !not set!\nEnabled: !${logsData.enabled}!`.replace(/!/g, '`'))

                    interaction.reply({ embeds: [replyEmbed], ephemeral: true })
                } else if (logsData.channelId && logsData.enabled){
                    const replyEmbed = new EmbedBuilder()
                    .setTitle('LOGS INFO')
                    .setColor('dde736')
                    .setDescription(`Get !info! about logs\n\nChannel: !${interaction.guild.channels.cache.get(logsData.channelId).name}!\nEnabled: !${logsData.enabled}!`.replace(/!/g, '`'))

                    interaction.reply({ embeds: [replyEmbed], ephemeral: true })
                }
            }
        } else if (interaction.options.getSubcommand() === 'enabled') {
            const enabled = interaction.options.getString('enable')

            const guildId = interaction.guild.id
            let logsData = await LogsSchema.findOne({ guildId: guildId })

            if (!logsData) {
                const replyEmbed = new EmbedBuilder()
                    .setTitle('LOGS CHANNEL ERROR')
                    .setColor('dde736')
                    .setDescription(`Logs channel !set! error\n\nLogs channel is not set\nTry !/logs channel!`.replace(/!/g, '`'))

                await interaction.reply({ embeds: [replyEmbed], ephemeral: true })
            } else {
                logsData.enabled = enabled
                const replyEmbed = new EmbedBuilder()
                    .setTitle('LOGS ENABLED UPDATED')
                    .setColor('dde736')
                    .setDescription(`Logs !enabled status! has been !updated!\n\nEnabled: !${enabled}!\n`.replace(/!/g, '`'))

                    interaction.reply({ embeds: [replyEmbed], ephemeral: true })
                    logsData.save()
            }
        } else if (interaction.options.getSubcommand() === 'channel') {
            const channel = interaction.options.getChannel('channel')

            const guildId = interaction.guild.id
            let logsData = await LogsSchema.findOne({ guildId: guildId })

            if (!interaction.guild.channels.cache.get(channel.id) || interaction.guild.channels.cache.get(channel.id).parentId === null) {
                const replyEmbed = new EmbedBuilder()
                    .setTitle('LOGS CHANNEL ERROR')
                    .setColor('dde736')
                    .setDescription(`Logs channel !set! error\n\nLogs channel is not set\nTry !/logs channel!`.replace(/!/g, '`'))

                await interaction.reply({ embeds: [replyEmbed], ephemeral: true })
                return;
            }

            if (!logsData) {
                logsData = await LogsSchema.create({
                    guildId: guildId,
                    channelId: channel.id,
                    enabled: ''
                })
                const replyEmbed = new EmbedBuilder()
                    .setTitle('LOGS CHANNEL UPDATED')
                    .setColor('dde736')
                    .setDescription(`Logs !channel! has been !updated!\n\nChannel: !${interaction.guild.channels.cache.get(channel.id).name}!\n`.replace(/!/g, '`'))
                    
                    interaction.reply({ embeds: [replyEmbed], ephemeral: true })
            } else {
                logsData.channelId = channel.id
                const replyEmbed = new EmbedBuilder()
                    .setTitle('LOGS CHANNEL UPDATED')
                    .setColor('dde736')
                    .setDescription(`Logs !channel! has been !updated!\n\nChannel: !${interaction.guild.channels.cache.get(channel.id).name}!\n`.replace(/!/g, '`'))
                    
                    interaction.reply({ embeds: [replyEmbed], ephemeral: true })
            }
            logsData.save()
        }
    }
}