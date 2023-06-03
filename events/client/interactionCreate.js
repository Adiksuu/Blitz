const { Events, EmbedBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const ticketsSchema = require('../schemas/ticketsSchema')

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.customId == 'tickets_create') {
			const guildId = interaction.guild.id
            let ticketsData = await ticketsSchema.findOne({ guildId: guildId })

			if (!ticketsData || !ticketsData.categoryId) return;

			const newChannel = await interaction.guild.channels.create({
				name: `Ticket_${interaction.user.username}`,
				type: ChannelType.GuildText,
				parent: ticketsData.categoryId,
				position: 1,
				permissionOverwrites: [
				  {
					id: interaction.guild.roles.everyone,
					deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
				  },
				  {
					id: interaction.user.id,
					allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
				  },
				],
			  });
			const channel = interaction.guild.channels.cache.get(newChannel.id)
			const replyEmbed = new EmbedBuilder()
				.setTitle('TICKET CREATED')
				.setDescription(`Your !ticket! has been !created!\n\nChannel: ${channel}`.replace(/!/g, '`'))
				.setColor('dde736')
			const channelEmbed = new EmbedBuilder()
			.setTitle('HELLO!!!')
			.setDescription(`Welcome ${interaction.user} in your !ticket! channel\n\n**How we can help you?**`.replace(/!/g, '`'))
			.setColor('dde736')
			
			await channel.send({ embeds: [channelEmbed] })
			await interaction.reply({ embeds: [replyEmbed], ephemeral: true })
		}
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(`Error executing ${interaction.commandName}`);
			console.error(error);
		}

	},
};