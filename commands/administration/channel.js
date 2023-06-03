const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('channel')
        .setDescription('Manage channels')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addSubcommand(subcommand =>
            subcommand
                .setName('create')
                .setDescription('Create a channel')
                .addStringOption(option => option.setName('name').setDescription('Type a channel name').setRequired(true))
                .addStringOption(option => option.setName('category_id').setDescription('Type a category ID').setRequired(true))
                .addStringOption(option => option.setName('type').setDescription('Select a channel type').setRequired(true).addChoices({name: 'Text channel', value: 'Text'}, {name: 'Voice channel', value: 'Voice'}))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription('Delete a channel')
                .addChannelOption(option => option.setName('name').setDescription('Type a channel name').setRequired(true))
        ),
    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'create') {
            const cName = interaction.options.getString('name')
            const cId = interaction.options.getString('category_id')
            const cType = interaction.options.getString('type')

            if (!interaction.guild.channels.cache.get(cId) || interaction.guild.channels.cache.get(cId).parentId !== null) {
                const replyEmbed = new EmbedBuilder()
                    .setTitle('CHANNEL CATEGORY ERROR')
                    .setColor('dde736')
                    .setDescription(`Channel category !set! error`.replace(/!/g, '`'))

                await interaction.reply({ embeds: [replyEmbed], ephemeral: true })
                return;
            }

            const replyEmbed = new EmbedBuilder()
                .setTitle('CHANNEL CREATED')
                .setColor('dde736')
                .setDescription(`Channel has been !created!\n\nChannel name: !${cName}!\nCategory ID: !${cId}!\nChannel type: !${cType}!\nCreated by: !${interaction.user.username}#${interaction.user.discriminator}!`.replace(/!/g, '`'))

            if (cType == 'Text') {
                await interaction.guild.channels.create({
                    name: cName,
                    type: ChannelType.GuildText,
                    parent: cId,
                    position: 1,
                })
            } 
            else if (cType == 'Voice') {
                await interaction.guild.channels.create({
                    name: cName,
                    type: ChannelType.GuildVoice,
                    parent: cId,
                    position: 1,
                })
            }
            await interaction.reply({ embeds: [replyEmbed], ephemeral: true })
        } 
        else if (interaction.options.getSubcommand() === 'delete') {
            const cName = interaction.options.getChannel('name')

            const replyEmbed = new EmbedBuilder()
                .setTitle('CHANNEL DELETED')
                .setColor('dde736')
                .setDescription(`Channel has been !deleted!\n\nChannel: !${cName.name}!\nDeleted by: !${interaction.user.username}#${interaction.user.discriminator}!`.replace(/!/g, '`'))
            
            await cName.delete();

            await interaction.reply({ embeds: [replyEmbed], ephemeral: true })
        }
    },
};
