const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js')
const LobbySchema = require('../../events/schemas/lobbySchema')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lobby')
        .setDescription('Manage lobby')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addSubcommand(subcommand =>
            subcommand
                .setName('set')
                .setDescription('Set lobby channel')
                .addChannelOption(option => option.setName('channel').setDescription('Select lobby channel').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('info')
                .setDescription('Get lobby info')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('role')
                .setDescription('Add auto-give role')
                .addRoleOption(option => option.setName('role').setDescription('Select role to auto-give').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('message')
                .setDescription('Set lobby messages')
                .addStringOption(option => option.setName('message').setDescription('Set lobby message').setRequired(true))
                .addStringOption(option => option.setName('message_type').setDescription('Set lobby message type').addChoices({name: 'Join messages', value: 'Join'}, {name: 'Leave messages', value: 'Leave'}).setRequired(true))
        ),
    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'set') {
            const channel = interaction.options.getChannel('channel')
            const guildId = interaction.guild.id

            let lobbyData = await LobbySchema.findOne({ guildId: guildId })

            if (!interaction.guild.channels.cache.get(channel.id) || interaction.guild.channels.cache.get(channel.id).parentId === null) {
                const replyEmbed = new EmbedBuilder()
                    .setTitle('LOBBY ERROR')
                    .setColor('dde736')
                    .setDescription(`A !error! with !lobby!`.replace(/!/g, '`'))

                await interaction.reply({ embeds: [replyEmbed], ephemeral: true })
                return
            }

            const replyEmbed = new EmbedBuilder()
                .setTitle('CHANNEL UPDATED!')
                .setColor('dde736')
                .setDescription(`Lobby channel has been !updated!\n\nChannel: !${channel.name}!\nChanged by: !${interaction.user.username}#${interaction.user.discriminator}!`.replace(/!/g, '`'))

            if (!lobbyData) {
                lobbyData = await LobbySchema.create({
                    guildId: guildId,
                    lobbyId: channel.id,
                    roleId: '',
                    joinMessage: '',
                    leaveMessage: ''
                })
            } else {
                lobbyData.lobbyId = channel.id
            }
            await lobbyData.save();

            await interaction.reply({ embeds: [replyEmbed], ephemeral: true })
        }
        else if (interaction.options.getSubcommand() === 'role') {
            const role = interaction.options.getRole('role')
            const guildId = interaction.guild.id

            let lobbyData = await LobbySchema.findOne({ guildId: guildId })

            if (!lobbyData || !lobbyData.lobbyId) {
                const replyEmbed = new EmbedBuilder()
                    .setTitle('LOBBY ERROR')
                    .setColor('dde736')
                    .setDescription(`A !error! with !lobby!`.replace(/!/g, '`'))

                await interaction.reply({ embeds: [replyEmbed], ephemeral: true })
            } else {
                lobbyData.roleId = role.id

                const replyEmbed = new EmbedBuilder()
                .setTitle('AUTO-ROLE UPDATED!')
                .setColor('dde736')
                .setDescription(`Lobby auto-role has been !updated!\n\nRole: !${interaction.guild.roles.cache.get(role.id).name}!\nChanged by: !${interaction.user.username}#${interaction.user.discriminator}!`.replace(/!/g, '`'))

                await interaction.reply({ embeds: [replyEmbed], ephemeral: true })
            }
            await lobbyData.save()
        }
        else if (interaction.options.getSubcommand() === 'message') {
            const guildId = interaction.guild.id

            let lobbyData = await LobbySchema.findOne({ guildId: guildId })
            let messageType = interaction.options.getString('message_type')

            if (!lobbyData) {
                const replyEmbed = new EmbedBuilder()
                    .setTitle('LOBBY CHANNEL ERROR')
                    .setColor('dde736')
                    .setDescription(`Message !set! error\n\nLobby channel is not set\nTry !/lobby set!`.replace(/!/g, '`'))

                await interaction.reply({ embeds: [replyEmbed], ephemeral: true })
            } else {
                const message = interaction.options.getString('message')

                const replyEmbed = new EmbedBuilder()
                .setTitle('MESSAGE UPDATED!')
                .setColor('dde736')
                .setDescription(`Lobby message has been !updated!\n\nChannel: !${interaction.guild.channels.cache.get(lobbyData.lobbyId).name}!\nMessage: !${message}!\nMessage type: !${messageType}!\nChanged by: !${interaction.user.username}#${interaction.user.discriminator}!`.replace(/!/g, '`'))

                if (messageType.includes('Join')) {
                    lobbyData.joinMessage = message
                } else {
                    lobbyData.leaveMessage = message
                }
                await lobbyData.save();

                interaction.reply({ embeds: [replyEmbed], ephemeral: true })
            }

        }
        else if (interaction.options.getSubcommand() === 'info') {
            const guildId = interaction.guild.id

            let lobbyData = await LobbySchema.findOne({ guildId: guildId })
            let channelRep = ''
            let roleRep = ''
            let jMessageRep = ''
            let lMessageRep = ''

            if (lobbyData && lobbyData.lobbyId) {
                channelRep = interaction.guild.channels.cache.get(lobbyData.lobbyId).name
            } else {
                channelRep = 'Not set'
            }
            if (lobbyData && lobbyData.joinMessage) {
                jMessageRep = 'Yes'
            } else {
                jMessageRep = 'Not set'
            }
            if (lobbyData && lobbyData.leaveMessage) {
                lMessageRep = 'Yes'
            } else {
                lMessageRep = 'Not set'
            }
            if (lobbyData && lobbyData.roleId) {
                roleRep = interaction.guild.roles.cache.get(lobbyData.roleId).name
            } else {
                roleRep = 'Not set'
            }

            const replyEmbed = new EmbedBuilder()
                .setTitle('LOBBY INFO')
                .setColor('dde736')
                .setDescription(`Get !info! about lobby\n\nChannel: !${channelRep}!\nRole: !${roleRep}!\nJoin message: !${jMessageRep}!\nLeave message: !${lMessageRep}!`.replace(/!/g, '`'))

            await interaction.reply({ embeds: [replyEmbed], ephemeral: true })
        }
    }
}