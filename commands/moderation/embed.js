const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('embed')
		.setDescription('Sends embed message!')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
		.addStringOption(option =>
			option
				.setName('color')
				.setDescription('Type a hex code without # symbole')
				.setRequired(true))
		.addStringOption(option =>
			option
				.setName('title')
				.setDescription('Type embed title')
				.setRequired(true))
		.addStringOption(option =>
			option
				.setName('message')
				.setDescription('Type message content')
				.setRequired(true)),
	async execute(interaction) {
		const color = interaction.options.getString('color');
		const title = interaction.options.getString('title');
		const message = interaction.options.getString('message').replace(/\\n/g, '\n');

		const channel = interaction.channel;

		const privateEmbed = new EmbedBuilder()
		.setColor("dde736")
		.setTitle("PUBLISHED!!")
		.setDescription(`✅ Embed successful published!`)
		.setFooter({ text: `${interaction.user.username}#${interaction.user.discriminator}`, iconURL: interaction.user.avatarURL({ format: 'png', dynamic: true, size: 128 }) })
		const channelEmbed = new EmbedBuilder()
		.setColor(color)
		.setTitle(title)
		.setDescription(message)
		.setFooter({ text: `${interaction.user.username}#${interaction.user.discriminator}`, iconURL: interaction.user.avatarURL({ format: 'png', dynamic: true, size: 128 }) })
		.setTimestamp()

		await channel.send({ embeds: [channelEmbed] })
		await interaction.reply({ embeds: [privateEmbed], ephemeral: true });
	},
};
