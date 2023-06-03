const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const WarnSchema = require('../../events/schemas/warnSchema')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('warn')
		.setDescription('Warns player!')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addSubcommand(subcommand =>
            subcommand.setName('info').setDescription('Get info about member warnings').addMentionableOption(option => option.setName('member').setDescription('Select member to get info').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand.setName('add').setDescription('Add warn to member').addMentionableOption(option => 
                option
                    .setName('member')
                    .setDescription('Select a member to warn')
                    .setRequired(true))
            .addStringOption(option => 
                option
                    .setName('reason')
                    .setDescription('Select reason')
                    .setRequired(true))
        ),
    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'add') {
            const target = interaction.options.getMentionable('member')
            const reason = interaction.options.getString('reason')

            const guildId = interaction.guild.id
            let warnData = await WarnSchema.findOne({ guildId: guildId, userId: target.id })

            const authorId = interaction.user.id

            const warning = {
                author: authorId,
                authorName: interaction.user.username,
                timestamp: new Date().getTime(),
                reason: reason,
            };

            if (!warnData) {
                warnData = await WarnSchema.create({
                    guildId: guildId,
                    userId: target.id,
                    warnings: warning
                })
                const replyEmbed = new EmbedBuilder()
                    .setColor("dde736")
                    .setTitle("MEMBER WARNED")
                    .setDescription(`User has been !warned!\n\nWarned: !${target}!\nWarns: !${warnData.warnings.length}!\nWarned by: !${interaction.user.username}#${interaction.user.discriminator}!\nReason: !${reason}!`.replace(/!/g, '`'))

                    await interaction.reply({ embeds: [replyEmbed], ephemeral: true });

            } else {
                await WarnSchema.findOneAndUpdate(
                    { guildId: guildId, userId: target.id },
                    { $push: { warnings: warning } }
                );      
                const replyEmbed = new EmbedBuilder()
                    .setColor("dde736")
                    .setTitle("MEMBER WARNED")
                    .setDescription(`User has been !warned!\n\nWarned: !${target}!\nWarns: !${warnData.warnings.length + 1}!\nWarned by: !${interaction.user.username}#${interaction.user.discriminator}!\nReason: !${reason}!`.replace(/!/g, '`'))
        
                    await interaction.reply({ embeds: [replyEmbed], ephemeral: true });
            }
        }
        else if (interaction.options.getSubcommand() === 'info') {
            const target = interaction.options.getMentionable('member')

            const guildId = interaction.guild.id
            let warnData = await WarnSchema.findOne({ guildId: guildId, userId: target.id })

            if (!warnData || !warnData.warnings[0]) {
                const replyEmbed = new EmbedBuilder()
                    .setColor("dde736")
                    .setTitle("MEMBER NOT FOUND")
                    .setDescription(`User not !found!\n\nUser !${interaction.guild.members.cache.get(target.id).user.username} not found!`.replace(/!/g, '`'))
        
                await interaction.reply({ embeds: [replyEmbed], ephemeral: true });
            } else {
                const replyEmbed = new EmbedBuilder()
                .setColor("dde736")
                .setTitle("MEMBER WARNS")
                .setDescription(`User !found!\n\nUser !${interaction.guild.members.cache.get(target.id).user.username}#${interaction.guild.members.cache.get(target.id).user.discriminator}!\nWarns count: !${warnData.warnings.length}!`.replace(/!/g, '`'))
    
                await interaction.reply({ embeds: [replyEmbed], ephemeral: true });
            }
        }
    }
}