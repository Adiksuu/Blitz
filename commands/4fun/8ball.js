const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription("Let's random response!")
        .addStringOption(option => option.setName('message').setDescription('Add message to response').setRequired(true)),
    async execute(interaction) {
        const gNum = Math.floor(Math.random() * 5)
        let gString = ''

        const question = interaction.options.getString('message')
        
        if (gNum == 0) {
            gString = 'Yes'
        } 
        else if (gNum == 1) {
            gString = 'No'
        }
        else if (gNum == 2) {
            gString = 'Maybe Yes'
        }
        else if (gNum == 3) {
            gString = 'Maybe No'
        }
        else if (gNum == 4) {
            gString = "I don't know"
        }
        
        const replyEmbed = new EmbedBuilder()
            .setTitle('8BALL')
            .setColor('dde736')
            .setDescription(`A !8ball! has been made \n\nResponse for your question %%%${question}%%%\nIs: **${gString}**`.replace(/!/g, '`').replace(/%%%/g, '```'))

        await interaction.reply({ embeds: [replyEmbed], ephemeral: true })
    }
}