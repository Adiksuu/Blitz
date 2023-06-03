const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Kicks player!')
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addMentionableOption(option => 
            option
                .setName('member')
                .setDescription('Select a member to kick')
                .setRequired(true))
        .addStringOption(option => 
            option
                .setName('reason')
                .setDescription('Select')
                .setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.getMentionable('member')
        const reason = interaction.options.getString('reason')

        const replyEmbed = new EmbedBuilder()
		.setColor("dde736")
		.setTitle("MEMBER KICKED")
		.setDescription(`User has been !kicked!\n\nKicked: !${target}!\nKicked by: !${interaction.user.username}#${interaction.user.discriminator}!\nReason: !${reason}!`.replace(/!/g, '`'))

		await interaction.reply({ embeds: [replyEmbed], ephemeral: true });
        await target.kick()
    }
}