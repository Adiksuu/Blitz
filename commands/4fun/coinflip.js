const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription("Let's random!"),
    async execute(interaction) {
        const gNum = Math.floor(Math.random() * 2)
        let gString = ''
        
        if (gNum == 0) {
            gString = 'Heads'
        } else {
            gString = 'Tails'
        }
        
        const replyEmbed = new EmbedBuilder()
            .setTitle('COINFLIP')
            .setColor('dde736')
            .setDescription(`A !coinflip! has been made \n\nWins... **${gString}**`.replace(/!/g, '`'))

        await interaction.reply({ embeds: [replyEmbed], ephemeral: true })
    }
}