const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setcooldown')
        .setDescription('Set typing cooldown to your channel')
        .addNumberOption(option => option.setName('cooldown').setDescription('Type a cooldown in seconds').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        const channel = interaction.channel
        const cooldown = interaction.options.getNumber('cooldown')

        await channel.setRateLimitPerUser(cooldown)

        const replyEmbed = new EmbedBuilder()
            .setTitle('SLOWMODE')
            .setColor('dde736')
            .setDescription(`A !slowmode! has been activated \n\nSlowmode time: !${cooldown}sec!\nChanged by: !${interaction.user.username}#${interaction.user.discriminator}!`.replace(/!/g, '`').replace(/%%%/g, '```'))

        interaction.reply({ embeds: [replyEmbed], ephemeral: true })
    }
}