const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role')
        .setDescription('Manage roles')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
        .addSubcommand(subcommand => 
            subcommand
                .setName('create')
                .setDescription('Create a role')
                .addStringOption(option => option.setName('name').setDescription('Type a role name').setRequired(true))
                .addStringOption(option => option.setName('color').setDescription('Type a role color (hex)').setRequired(true))
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName('give')
                .setDescription('Give a role')
                .addUserOption(option => option.setName('user').setDescription('Type a user').setRequired(true))
                .addRoleOption(option => option.setName('role').setDescription('Type a role').setRequired(true))
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName('delete')
                .setDescription('Delete a role')
                .addStringOption(option => option.setName('id').setDescription('Type a role id').setRequired(true))
        ),
    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'create') {
            const rName = interaction.options.getString('name');
            const rColor = interaction.options.getString('color');

            const replyEmbed = new EmbedBuilder()
                .setTitle('ROLE CREATED')
                .setColor('dde736')
                .setDescription(`Role has been !created!\n\nRole name: !${rName}!\nRole color: !#${rColor}!\nCreated by: !${interaction.user.username}#${interaction.user.discriminator}!`.replace(/!/g, '`'));

            await interaction.guild.roles.create({
                name: rName,
                color: `#${rColor}`
            });
            await interaction.reply({ embeds: [replyEmbed], ephemeral: true });
        } 
        else if (interaction.options.getSubcommand() === 'delete') {
            const rId = interaction.options.getString('id');

            const role = interaction.guild.roles.cache.get(rId)

            const replyEmbed = new EmbedBuilder()
            .setTitle('ROLE DELETED')
            .setColor('dde736')
            .setDescription(`Role has been !deleted!\n\nRole name: !${role.name}!\nDeleted by: !${interaction.user.username}#${interaction.user.discriminator}!`.replace(/!/g, '`'));

            await role.delete()
            await interaction.reply({ embeds: [replyEmbed], ephemeral: true })
        }
        else if (interaction.options.getSubcommand() === 'give') {
            const role = interaction.options.getRole('role');
            const user = interaction.options.getMember('user');

            const replyEmbed = new EmbedBuilder()
            .setTitle('ROLE GIVED')
            .setColor('dde736')
            .setDescription(`Role has been !gived!\n\nRole name: !${role.name}!\nGived by: !${interaction.user.username}#${interaction.user.discriminator}!\nGived to: !${user.user.username}#${interaction.user.discriminator}!`.replace(/!/g, '`'));

            await user.roles.add(role);
            await interaction.reply({ embeds: [replyEmbed], ephemeral: true })
        }
    }
};
