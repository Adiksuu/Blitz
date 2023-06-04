const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pool')
        .setDescription('Manage pools')
        .addSubcommand(subcommand => 
            subcommand
                .setName('create')
                .setDescription('Create a pool')
                .addStringOption(option => option.setName('question').setDescription('Type a pool question').setRequired(true))
        ),
    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'create') {
            const question = interaction.options.getString('question')

            const privateEmbed = new EmbedBuilder()
                .setTitle("PUBLISHED!!")
                .setColor("dde736")
                .setDescription(`✅ Pool successful published!`)
                .setFooter({ text: `${interaction.user.username}#${interaction.user.discriminator}`, iconURL: interaction.user.avatarURL({ format: 'png', dynamic: true, size: 128 }) })
            const channelEmbed = new EmbedBuilder()
                .setTitle('POOL')
                .setDescription(`A new !pool!\n\n!Question:! **${question}**`.replace(/!/g, '`'))
                .setColor('dde736')
                .setTimestamp()
                .addFields([
                    { name: "Yes", value: '0', inline: true },
                    { name: "No", value: '0', inline: true }
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

            interaction.reply({ embeds: [privateEmbed], ephemeral: true })
            interaction.channel.send({ embeds: [channelEmbed], components: [poolButtons] })
        }
    }
}