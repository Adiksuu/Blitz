const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const ecoSchema = require('../../events/schemas/ecoSchema')
const shopSchema = require('../../events/schemas/shopSchema')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('economy')
        .setDescription('User economy')
        .addSubcommand(subcommand =>
            subcommand
                .setName('balance')
                .setDescription('Show my balance')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription('Show economy help')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('shop')
                .setDescription('Show economy shop')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('upgrades')
                .setDescription('Manage upgrades')
                .addStringOption(option => option.setName('upgrade').setDescription('Upgrade items from shop').addChoices({ name: 'wallet upgrade', value: 'wallet' }, { name: 'multiplier upgrade', value: 'multiplier' }).setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('buy')
                .setDescription('Manage items')
                .addStringOption(option => option.setName('item').setDescription('Buy items from shop').setRequired(true))
        ),
    async execute(interaction) {
        const option = interaction.options.getSubcommand()

        if (option === 'balance') {
            const guildId = interaction.guild.id
            const userId = interaction.user.id

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
            ecoData.save()

            const replyEmbed = new EmbedBuilder()
                .setTitle('USER ECONOMY')
                .setColor('dde736')
                .setDescription(`User !economy! info:\n\nUser: ${interaction.user}\n\nMoney: !${ecoData.money}/${ecoData.wallet}!\nMultiplier: !${ecoData.multiplayer}x!`.replace(/!/g, '`'))

            await interaction.reply({ embeds: [replyEmbed], ephemeral: true })
        } else if (option === 'buy') {
            const guildId = interaction.guild.id
            const userId = interaction.user.id
        
            const item = interaction.options.getString('item')
        
            let ecoData = await ecoSchema.findOne({ guildId: guildId, userId: userId })
            let shopData = await shopSchema.findOne({ guildId: guildId })
        
            if (!ecoData) {
                ecoData = await ecoSchema.create({
                    guildId: guildId,
                    userId: userId,
                    money: 0,
                    wallet: 750,
                    multiplayer: 1,
                })
        
                ecoData.save()
        
                const replyEmbed = new EmbedBuilder()
                    .setTitle('ITEM BOUGHT ERROR')
                    .setDescription(`You can't buy item !${item}!. You don't have !money!\n\nYour balance: !${ecoData.money}/${ecoData.wallet}!`.replace(/!/g, '`'))
                    .setColor('dde736')
        
                interaction.reply({ embeds: [replyEmbed], ephemeral: true })
            } else {
                if (shopData) {
                    let bought = false
                    for (let i = 0; i < shopData.items.length; i++) {
                        if (shopData.items[i].name == item) {
                            if (ecoData.money >= shopData.items[i].cost) {
                                if (bought == true) return
        
                                const replyEmbed = new EmbedBuilder()
                                    .setTitle('ITEM BOUGHT')
                                    .setDescription(`You just !bought! item !${item}! from the shop for !${shopData.items[i].cost}! money\n\nYour balance: !${ecoData.money - shopData.items[i].cost}/${ecoData.wallet}!`.replace(/!/g, '`'))
                                    .setColor('dde736')
        
                                await interaction.reply({ embeds: [replyEmbed], ephemeral: true })

                                interaction.guild.members.cache.get(userId).roles.add(shopData.items[i].role)
        
                                ecoData.money -= shopData.items[i].cost
        
                                ecoData.save()
                                bought = true
                            }
                        }
                    }
        
                    if (bought == false) {
                        const replyEmbed = new EmbedBuilder()
                            .setTitle('ITEM BOUGHT ERROR')
                            .setDescription(`You can't buy item !${item}!. Item not found`.replace(/!/g, '`'))
                            .setColor('dde736')
        
                        interaction.reply({ embeds: [replyEmbed], ephemeral: true })
                    }
                } else {
                    const replyEmbed = new EmbedBuilder()
                        .setTitle('SHOP ITEM REMOVE ERROR')
                        .setDescription(`No items !found! in shop`.replace(/!/g, '`'))
                        .setColor('dde736');
        
                    interaction.reply({ embeds: [replyEmbed], ephemeral: true });
                }
            }
        } else if (option === 'help') {
            const replyEmbed = new EmbedBuilder()
                .setTitle('ECONOMY HELP')
                .setColor('dde736')
                .setDescription(`!Economy! help info:\n\nTo earn !money! you must sends messages or talks on voice channels.\nYou have wallet, you must !upgrade wallet! to get more capacity of money\n\nThe multiplier is an !additional percentage! to your earnings\n\nYou can spend your money to upgrade !wallet! and !multiplier!, or buy server items !(added by server administration)!`.replace(/!/g, '`'))

            await interaction.reply({ embeds: [replyEmbed], ephemeral: true })
        } else if (option === 'shop') {
            const guildId = interaction.guild.id
            const userId = interaction.user.id

            let ecoData = await ecoSchema.findOne({ guildId: guildId, userId: userId })
            let shopData = await shopSchema.findOne({ guildId: guildId})

            if (!ecoData) {
                ecoData = await ecoSchema.create({
                    guildId: guildId,
                    userId: userId,
                    money: 0,
                    wallet: 750,
                    multiplayer: 1,
                })
            }
            ecoData.save()

            let items = ''

            if (shopData) {
                for (let i = 0; i < shopData.items.length; i++) {
                    const iName = shopData.items[i].name
                    const iCost = shopData.items[i].cost
                    const iRole = shopData.items[i].role
    
                    items += `**• ${iName}** !(cost: ${iCost})! !(role:! <@&${iRole}>!)!\n`
                }
            }

            const replyEmbed = new EmbedBuilder()
                .setTitle('ECONOMY SHOP')
                .setColor('dde736')
                .setDescription(`The economy !shop!\n\nYour balance: !${ecoData.money}/${ecoData.wallet}!\n\n**CONSTANT ITEMS:**\n**• Wallet Upgrade** !(cost: 550)! !(capacity: ${ecoData.wallet + 500})!\n**• Multiplier Upgrade** !(cost: ${1250 * ecoData.multiplayer})! !(multiplier: ${ecoData.multiplayer + 1})!\n\n**SERVER ITEMS:**\n${items}`.replace(/!/g, '`'))

            interaction.reply({ embeds: [replyEmbed], ephemeral: true })
        } else if (option === 'upgrades') {
            const selected = interaction.options.getString('upgrade')

            const guildId = interaction.guild.id
            const userId = interaction.user.id

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
            ecoData.save()

            if (selected == 'wallet') {
                if (ecoData.money >= 550) {
                    const replyEmbed = new EmbedBuilder()
                        .setTitle('ITEM BOUGHT')
                        .setDescription(`You just !bought! item !${selected}! from the shop for !550! money\n\nYour balance: !${ecoData.money - 550}/${ecoData.wallet + 500}!`.replace(/!/g, '`'))
                        .setColor('dde736')

                    ecoData.wallet += 500
                    ecoData.money -= 550

                    interaction.reply({ embeds: [replyEmbed], ephemeral: true })
                } else {
                    const replyEmbed = new EmbedBuilder()
                    .setTitle('ITEM BOUGHT ERROR')
                    .setDescription(`You can't buy item !${selected}!. You don't have !money!\n\nYour balance: !${ecoData.money}/${ecoData.wallet}!`.replace(/!/g, '`'))
                    .setColor('dde736')

                    interaction.reply({ embeds: [replyEmbed], ephemeral: true })
                }
            } else if (selected == 'multiplier') {
                if (ecoData.money >= (1250 * ecoData.multiplayer)) {
                    const replyEmbed = new EmbedBuilder()
                        .setTitle('ITEM BOUGHT')
                        .setDescription(`You just !bought! item !${selected}! from the shop for !${1250 * ecoData.multiplayer}! money\n\nYour balance: !${ecoData.money - (1250 * ecoData.multiplayer)}/${ecoData.wallet}!`.replace(/!/g, '`'))
                        .setColor('dde736')

                    ecoData.money -= (1250 * ecoData.multiplayer)
                    ecoData.multiplayer += 1

                    interaction.reply({ embeds: [replyEmbed], ephemeral: true })
                } else {
                    const replyEmbed = new EmbedBuilder()
                    .setTitle('ITEM BOUGHT ERROR')
                    .setDescription(`You can't buy item !${selected}!. You don't have !money!\n\nYour balance: !${ecoData.money}/${ecoData.wallet}!`.replace(/!/g, '`'))
                    .setColor('dde736')

                    interaction.reply({ embeds: [replyEmbed], ephemeral: true })
                }
            }
        }
    }
}