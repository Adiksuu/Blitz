const { Events } = require('discord.js')
const ecoSchema = require('../schemas/ecoSchema')

module.exports = {
    name: Events.MessageCreate,

    async execute(message) {
        const guildId = message.guild.id
        const userId = message.author.id

        
        let ecoData = await ecoSchema.findOne({ guildId: guildId, userId: userId })
        
        
        if (!ecoData) {
            ecoData = await ecoSchema.create({
                guildId: guildId,
                userId: userId,
                money: 0,
                wallet: 750,
                multiplayer: 1,
            })
        }

        let earn = Math.floor(Math.random() * 4) * ecoData.multiplayer

        if ((ecoData.money + earn) <= ecoData.wallet) {
            ecoData.money += earn
        } else {
            ecoData.money = ecoData.wallet
        }

        ecoData.save()
    }
}