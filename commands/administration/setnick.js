const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setnick')
        .setDescription('Set custom nick to mentioned user')
        .addUserOption(option => option.setName('target').setDescription('Select a user to change name').setRequired(true))
        .addStringOption(option => option.setName('nick').setDescription('Select a custom nickname').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const nickname = interaction.options.getString('nick')

        const member = interaction.guild.members.cache.get(target.id)

        const replyEmbed = new EmbedBuilder()
            .setTitle('NICKNAME CHANGED!')
            .setColor('dde736')
            .setDescription(`A !nickname! has been changed \n\nNew nickname: !${nickname}!\n\nChanged by: !${interaction.user.username}#${interaction.user.discriminator}!\nChanged for: !${member.user.username}#${member.user.discriminator}!`.replace(/!/g, '`').replace(/%%%/g, '```'))

        member.setNickname(nickname)

        await interaction.reply({ embeds: [replyEmbed], ephemeral: true })
    }
}