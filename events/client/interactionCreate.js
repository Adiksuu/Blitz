const { Events, EmbedBuilder, ChannelType, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const ticketsSchema = require('../schemas/ticketsSchema')
const poolsSchema = require('../schemas/poolSchema')

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
		} else if (interaction.customId == 'pool_no') {
			const userId = interaction.user.id;
  			const messageId = interaction.message.id;

			const yCount = parseInt(interaction.message.embeds[0].data.fields[0].value)
			const nCount = parseInt(interaction.message.embeds[0].data.fields[1].value) + 1
			const question = interaction.message.embeds[0].data.description.replace('A new `pool`\n\n`Question:`', '')

			let votedData = await poolsSchema.findOne({ userId: userId, messageId: messageId })

			if (votedData) {
				const alreadyVotedEmbed = new EmbedBuilder()
					.setColor('dde736')
					.setTitle('VOTE ERROR')
					.setDescription(`You've !already! voted in this poll.`.replace(/!/g, '`'));
		
				await interaction.reply({ embeds: [alreadyVotedEmbed], ephemeral: true });
				return;
			}

			const privateEmbed = new EmbedBuilder()
				.setColor("dde736")
				.setTitle("VOTED!!")
				.setDescription(`✅ Thanks for !voting!`.replace(/!/g, '`'));
			const channelEmbed = new EmbedBuilder()
                .setTitle('POOL')
                .setDescription(`A new !pool!\n\n!Question:! ${question}`.replace(/!/g, '`'))
                .setColor('dde736')
                .setTimestamp()
                .addFields([
                    { name: "Yes", value: yCount.toString(), inline: true },
                    { name: "No", value: nCount.toString(), inline: true }
                ]);
			const poolButtons = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('pool_yes')
					.setLabel('YES')
					.setStyle(ButtonStyle.Success),
				new ButtonBuilder()
				.setCustomId('pool_no')
				.setLabel('NO')
				.setStyle(ButtonStyle.Danger),
			)

			const votedUser = new poolsSchema({ userId: userId, messageId: messageId });
      		votedUser.save();
			
			await interaction.message.edit({ embeds: [channelEmbed], components: [poolButtons] });
			await interaction.reply({ embeds: [privateEmbed], ephemeral: true })
		} else if (interaction.customId == 'pool_yes') {
			const userId = interaction.user.id;
  			const messageId = interaction.message.id;

			const yCount = parseInt(interaction.message.embeds[0].data.fields[0].value) + 1
			const nCount = parseInt(interaction.message.embeds[0].data.fields[1].value)
			const question = interaction.message.embeds[0].data.description.replace('A new `pool`\n\n`Question:`', '')

			let votedData = await poolsSchema.findOne({ userId: userId, messageId: messageId })

			if (votedData) {
				const alreadyVotedEmbed = new EmbedBuilder()
					.setColor('dde736')
					.setTitle('VOTE ERROR')
					.setDescription(`You've !already! voted in this poll.`.replace(/!/g, '`'));
		
				await interaction.reply({ embeds: [alreadyVotedEmbed], ephemeral: true });
				return;
			}

			const privateEmbed = new EmbedBuilder()
				.setColor("dde736")
				.setTitle("VOTED!!")
				.setDescription(`✅ Thanks for !voting!`.replace(/!/g, '`'));
			const channelEmbed = new EmbedBuilder()
                .setTitle('POOL')
                .setDescription(`A new !pool!\n\n!Question:! ${question}`.replace(/!/g, '`'))
                .setColor('dde736')
                .setTimestamp()
                .addFields([
                    { name: "Yes", value: yCount.toString(), inline: true },
                    { name: "No", value: nCount.toString(), inline: true }
                ]);
			const poolButtons = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('pool_yes')
					.setLabel('YES')
					.setStyle(ButtonStyle.Success),
				new ButtonBuilder()
				.setCustomId('pool_no')
				.setLabel('NO')
				.setStyle(ButtonStyle.Danger),
			)

			const votedUser = new poolsSchema({ userId: userId, messageId: messageId });
      		votedUser.save();
			
			await interaction.message.edit({ embeds: [channelEmbed], components: [poolButtons] });
			await interaction.reply({ embeds: [privateEmbed], ephemeral: true })
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