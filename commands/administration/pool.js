const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const poolsSchema = require('../../events/schemas/poolSchema')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pool')
        .setDescription('Manage pools')
        .addSubcommand(subcommand => 
            subcommand
                .setName('create')
                .setDescription('Create a pool')
                .addStringOption(option => option.setName('question').setDescription('Type a pool question').setRequired(true))
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName('info')
                .setDescription('Get pool info')
                .addStringOption(option => option.setName('messageid').setDescription('Type a message id').setRequired(true))
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
        else if (interaction.options.getSubcommand() === 'info') {
            const messageId = interaction.options.getString('messageid');
          
            let poolData = await poolsSchema.find({ messageId: messageId });
          
            if (!poolData) {
              const errorEmbed = new EmbedBuilder()
                .setTitle('POOL ERROR')
                .setColor('dde736')
                .setDescription('An error occurred with the pool'.replace(/!/g, '`'));
              await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
              return;
            }
          
            let users = '';
          
            for (let i = 0; i < poolData.length; i++) {
                await interaction.guild.members.fetch();
                users += `${interaction.guild.members.cache.get(poolData[i].userId).user.username}\n`;
            }
          
            const replyEmbed = new EmbedBuilder()
              .setTitle('POOL INFO')
              .setColor('dde736')
              .setDescription(`Pool !info!:\n\nPool ID: !${messageId}!\n\nVotes count: !${poolData.length}!\n\nVoted by: \n!${users}!`.replace(/!/g, '`'));
            await interaction.reply({ embeds: [replyEmbed], ephemeral: true });
        }          
    }
}