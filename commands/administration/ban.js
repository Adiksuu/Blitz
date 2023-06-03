const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Bans player!')
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addMentionableOption(option => 
            option
                .setName('member')
                .setDescription('Select a member to ban')
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
		.setTitle("MEMBER BANNED")
		.setDescription(`User has been !banned!\n\nBanned: !${target}!\nBanned by: !${interaction.user.username}#${interaction.user.discriminator}!\nReason: !${reason}!`.replace(/!/g, '`'))

		await interaction.reply({ embeds: [replyEmbed], ephemeral: true });
        await target.ban()
    }
}