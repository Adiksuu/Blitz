const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js')
const ticketsSchema = require('../../events/schemas/ticketsSchema')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Manage tickets')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addSubcommand(subcommand => 
            subcommand
                .setName('publish')
                .setDescription('Publish tickets manager to channel')
                .addChannelOption(option => option.setName('channel').setDescription('Select channel to publish').setRequired(true))
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName('delete')
                .setDescription('Delete current ticket channel')
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName('category')
                .setDescription('Set tickets category')
                .addStringOption(option => option.setName('category_id').setDescription('Type category ID to send tickets channels').setRequired(true))
        ),
    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'publish') {
            const channel = interaction.options.getChannel('channel')

            const guildId = interaction.guild.id
            let ticketsData = await ticketsSchema.findOne({ guildId: guildId })

            if (!ticketsData) {
                const replyEmbed = new EmbedBuilder()
                    .setTitle('TICKETS CATEGORY ERROR')
                    .setColor('dde736')
                    .setDescription(`Tickets category !set! error\n\nTickets category is not set\nTry !/tickets category!`.replace(/!/g, '`'))

                await interaction.reply({ embeds: [replyEmbed], ephemeral: true })
                return;
            }

            const channelEmbed = new EmbedBuilder()
                .setTitle('CREATE A TICKET')
                .setDescription(`Click the button to create your !ticket!`.replace(/!/g, '`'))
                .setColor('dde736')

            const replyEmbed = new EmbedBuilder()
            .setTitle('TICKET MANAGER PUBLISHED!')
            .setDescription(`You has been !published! the !ticket! manager to channel ${interaction.guild.channels.cache.get(channel.id)}`.replace(/!/g, '`'))
            .setColor('dde736')

            const ticketButtons = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('tickets_create')
                        .setLabel('CREATE TICKET')
                        .setStyle(ButtonStyle.Primary),
                );
            
            await channel.send({ embeds: [channelEmbed], components: [ticketButtons] })
            await interaction.reply({ embeds: [replyEmbed], ephemeral: true })
        } else if (interaction.options.getSubcommand() === 'category') {
            const guildId = interaction.guild.id
            const category = interaction.options.getString('category_id')

            let ticketsData = await ticketsSchema.findOne({ guildId: guildId })

            if (!interaction.guild.channels.cache.get(category) || interaction.guild.channels.cache.get(category).parentId !== null) {
                const replyEmbed = new EmbedBuilder()
                    .setTitle('TICKETS CATEGORY ERROR')
                    .setColor('dde736')
                    .setDescription(`Tickets category !set! error\n\nTickets category is not set\nTry !/tickets category!`.replace(/!/g, '`'))

                await interaction.reply({ embeds: [replyEmbed], ephemeral: true })
                return;
            }

            if (!ticketsData) {
                ticketsData = await ticketsSchema.create({
                    guildId: guildId,
                    categoryId: category
                })
                const replyEmbed = new EmbedBuilder()
                    .setTitle('TICKETS CATEGORY UPDATED')
                    .setColor('dde736')
                    .setDescription(`Tickets category has been !updated!\n\nCategory: !${interaction.guild.channels.cache.get(category).name}!`.replace(/!/g, '`'))
                    
                interaction.reply({ embeds: [replyEmbed], ephemeral: true })
                ticketsData.save() // Zapisz nowo utworzony obiekt ticketsData do bazy danych
            } else {
                const replyEmbed = new EmbedBuilder()
                    .setTitle('TICKETS CATEGORY UPDATED')
                    .setColor('dde736')
                    .setDescription(`Tickets category has been !updated!\n\nCategory: !${interaction.guild.channels.cache.get(category).name}!`.replace(/!/g, '`'))
                
                ticketsData.categoryId = category

                interaction.reply({ embeds: [replyEmbed], ephemeral: true })
                ticketsData.save() // Zapisz zaktualizowany obiekt ticketsData do bazy danych
            }
        } else if (interaction.options.getSubcommand() === 'delete') {
            const channel = interaction.channel;

            const errorEmbed = new EmbedBuilder()
                .setColor("ff0000")
                .setTitle("ERROR WITH DELETING CHANNEL")
                .setDescription(`Channel cannot be !deleted!, only tickets channels can be !deleted!`.replace(/!/g, '`'))
                
            if (!channel.name.includes("ticket_")) {
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true })
                return;
            }

            const channelEmbed = new EmbedBuilder()
                .setColor("ff0000")
                .setTitle("TICKET CLOSED")
                .setDescription(`Ticket **${channel}** has been !closed!\n\nIn 10seconds, !this! channel has been deleted`.replace(/!/g, '`'))
            const replyEmbed = new EmbedBuilder()
                .setColor("dde736")
                .setTitle("CHANNEL CLOSED")
                .setDescription(`You closed the channel!`)

            await interaction.reply({ embeds: [replyEmbed], ephemeral: true });
            await channel.send({ embeds: [channelEmbed] });

            await setTimeout(() => {
                channel.delete();
            }, 10 * 1000);
        }
    }
}