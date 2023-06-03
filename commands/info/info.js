const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Get information')
        .addSubcommand(subcommand =>
            subcommand
                .setName('user')
                .setDescription('Get information about a user')
                .addUserOption(option => option.setName('target').setDescription('Select a user'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('server')
                .setDescription('Get information about the server')
        ),
    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'user') {
            const user = interaction.options.getUser('target')
            if (user) {
                const uName = `${user.username}#${user.discriminator}`
                const uBot = user.bot
                const uId = user.id

                const replyEmbed = new EmbedBuilder()
                    .setTitle('USER INFO')
                    .setColor('dde736')
                    .setDescription(`Informations about !${uName}! member\n\nNickname: **${uName}**\nIs bot: **${uBot}**\nID: **${uId}**`.replace(/!/g, '`'))

                await interaction.reply({ embeds: [replyEmbed], ephemeral: true })
            } else {
                const uName = `${interaction.user.username}#${interaction.user.discriminator}`
                const uBot = interaction.user.bot
                const uId = interaction.user.id

                const replyEmbed = new EmbedBuilder()
                    .setTitle('USER INFO')
                    .setColor('dde736')
                    .setDescription(`Informations about !you! member\n\nNickname: **${uName}**\nIs bot: **${uBot}**\nID: **${uId}**`.replace(/!/g, '`'))

                    await interaction.reply({ embeds: [replyEmbed], ephemeral: true })

            }
        } 
        else if (interaction.options.getSubcommand() === 'server') {

            const gName = interaction.guild.name
            const gTimestamp = interaction.guild.joinedTimestamp
            const gOwner = interaction.guild.ownerId
            const gMembers = interaction.guild.memberCount
            const gChannels = interaction.guild.channels.cache.size
            const gRoles = interaction.guild.roles.cache.size
            const gBoosts = interaction.guild.premiumSubscriptionCount

            const replyEmbed = new EmbedBuilder()
                .setTitle('SERVER INFO')
                .setColor('dde736')
                .setDescription(`Informations about !this! server\n\nServer name: **${gName}**\nServer created date: **<t:${parseInt(gTimestamp / 1000)}:R>**\nServer owner: **<@${gOwner}>**\nServer nitro boosts: **${gBoosts}**`.replace(/!/g, '`'))
                .addFields({ name: "Members count", value: `${gMembers}`, inline: true })
                .addFields({ name: "Channels count", value: `${gChannels}`, inline: true })
                .addFields({ name: "Roles count", value: `${gRoles}`, inline: true })

            interaction.reply({ embeds: [replyEmbed], ephemeral: true })
        }
    },
};
