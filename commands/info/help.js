const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('See all bot commands'),
    async execute(interaction) {
        const replyEmbed = new EmbedBuilder()
            .setTitle("HELP - COMMAND LIST")
            .setColor("dde736")
            .setDescription(`I have a !17! command\n\n**INFO (2)**\n%%%help, info, %%%\n**MODERATION (5)**\n%%%automod, lobby, ticket, logs, embed%%%\n**ADMINISTRATION (8)**%%%warn, kick, ban, role, channel, clear, setnick, setcooldown%%%\n**4FUN (2)**\n%%%8ball, coinflip%%%`.replace(/%%%/g, '```').replace(/!/g, '`'));

        interaction.reply({ embeds: [replyEmbed], ephemeral: true });
    },
};
