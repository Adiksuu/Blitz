const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Clears chat!')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
		.addNumberOption(option =>
			option
				.setName('count')
				.setDescription('Type a count (max 100)')
				.setRequired(true)),
	async execute(interaction) {
		const count = interaction.options.getNumber('count');

        const channel = interaction.channel;

		const replyEmbed = new EmbedBuilder()
		.setColor("dde736")
		.setTitle("CHAT CLEARED")
		.setDescription(`Chat has been !cleared!\n\nCleared: !${count} messages!\nCleared by: !${interaction.user.username}#${interaction.user.discriminator}!`.replace(/!/g, '`'))
        .setFooter({ text: `${interaction.user.username}#${interaction.user.discriminator}`, iconURL: interaction.user.avatarURL({ format: 'png', dynamic: true, size: 128 }) })
        .setTimestamp()

        await channel.bulkDelete(count);
		await interaction.reply({ embeds: [replyEmbed], ephemeral: true });
	},
};
