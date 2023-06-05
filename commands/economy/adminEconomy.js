const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js')
const ecoSchema = require('../../events/schemas/ecoSchema')
const shopSchema = require('../../events/schemas/shopSchema')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('eco')
        .setDescription('Manage users economy')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addSubcommand(subcommand => 
            subcommand
                .setName('info')
                .setDescription('Get info about member economy')
                .addMentionableOption(option => option.setName('member').setDescription('Select member').setRequired(true))
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName('set')
                .setDescription('Set member economy')
                .addMentionableOption(option => option.setName('member').setDescription('Select member').setRequired(true))
                .addNumberOption(option => option.setName('value').setDescription('Select value to set').setRequired(true))
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName('add')
                .setDescription('Add member economy')
                .addMentionableOption(option => option.setName('member').setDescription('Select member').setRequired(true))
                .addNumberOption(option => option.setName('value').setDescription('Select value to add').setRequired(true))
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName('remove')
                .setDescription('Remove member economy')
                .addMentionableOption(option => option.setName('member').setDescription('Select member').setRequired(true))
                .addNumberOption(option => option.setName('value').setDescription('Select value to add').setRequired(true))
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName('reset')
                .setDescription('Reset member economy')
                .addMentionableOption(option => option.setName('member').setDescription('Select member').setRequired(true))
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName('additem')
                .setDescription('Add item to shop')
                .addStringOption(option => option.setName('item').setDescription('Type item name').setRequired(true))
                .addRoleOption(option => option.setName('role').setDescription('Select role to give').setRequired(true))
                .addNumberOption(option => option.setName('cost').setDescription('Type item cost').setRequired(true))
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName('removeitem')
                .setDescription('Remove item from shop')
                .addStringOption(option => option.setName('item').setDescription('Type item name').setRequired(true))
        ),
    async execute(interaction) {
        const option = interaction.options.getSubcommand()

        if (option === 'info') {
            const member = interaction.options.getMentionable('member')

            const guildId = interaction.guild.id
            const userId = member.id

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
                .setDescription(`User !economy! info:\n\nUser: ${member} \nUser ID: !${userId}!\nMoney: !${ecoData.money}/${ecoData.wallet}!\Multiplier: !${ecoData.multiplayer}x!`.replace(/!/g, '`'))

            await interaction.reply({ embeds: [replyEmbed], ephemeral: true })
        }
        else if (option === 'additem') {
            const iName = interaction.options.getString('item')
            const iRole = interaction.options.getRole('role')
            const iCost = interaction.options.getNumber('cost')

            const guildId = interaction.guild.id
            let shopData = await shopSchema.findOne({ guildId: guildId })

            const item = {
                name: iName,
                role: iRole,
                cost: iCost
            }

            if (!shopData) {
                shopData = await shopSchema.create({
                    guildId: guildId,
                    items: item
                })

                shopData.save()

                const replyEmbed = new EmbedBuilder()
                    .setTitle('SHOP ITEM CREATED')
                    .setDescription(`A shop item !created!\n\n**ITEM INFO:**\nName: !${iName}!\nCost: !${iCost}!\nRole: ${iRole}`.replace(/!/g, '`'))
                    .setColor('dde736')

                interaction.reply({ embeds: [replyEmbed], ephemeral: true })
            } else {
                await shopSchema.findOneAndUpdate(
                    { guildId: guildId },
                    { $push: { items: item } }
                ); 

                shopData.save()

                const replyEmbed = new EmbedBuilder()
                    .setTitle('SHOP ITEM CREATED')
                    .setDescription(`A shop item !created!\n\n**ITEM INFO:**\nName: !${iName}!\nCost: !${iCost}!\nRole: ${iRole}`.replace(/!/g, '`'))
                    .setColor('dde736')

                interaction.reply({ embeds: [replyEmbed], ephemeral: true })
            }
        }
        else if (option === 'removeitem') {
            const iName = interaction.options.getString('item');
        
            const guildId = interaction.guild.id;
            let shopData = await shopSchema.findOne({ guildId: guildId });
        
            if (!shopData) {
                const replyEmbed = new EmbedBuilder()
                    .setTitle('SHOP ITEM REMOVE ERROR')
                    .setDescription(`No items !found! in shop`.replace(/!/g, '`'))
                    .setColor('dde736');
        
                interaction.reply({ embeds: [replyEmbed], ephemeral: true });
            } else {
                const itemIndex = shopData.items.findIndex(item => item.name === iName);
        
                if (itemIndex !== -1) {
                    shopData.items.splice(itemIndex, 1);
                    await shopData.save();
        
                    const replyEmbed = new EmbedBuilder()
                        .setTitle('SHOP ITEM REMOVED')
                        .setDescription(`A shop item with the name !${iName}! has been removed.`.replace(/!/g, '`'))
                        .setColor('dde736');
        
                    interaction.reply({ embeds: [replyEmbed], ephemeral: true });
                } else {
                    const replyEmbed = new EmbedBuilder()
                    .setTitle('SHOP ITEM REMOVE ERROR')
                    .setDescription(`Item !${iName}! not found in the shop`.replace(/!/g, '`'))
                    .setColor('dde736');
        
                interaction.reply({ embeds: [replyEmbed], ephemeral: true });
                }
            }
        }
        else if (option === 'set') {
            const member = interaction.options.getMentionable('member')
            const value = interaction.options.getNumber('value')

            const guildId = interaction.guild.id
            const userId = member.id

            
            let ecoData = await ecoSchema.findOne({ guildId: guildId, userId: userId })
            
            if (value > ecoData.wallet) {
                const replyEmbed = new EmbedBuilder()
                .setTitle('USER MONEY SET ERROR')
                .setColor('dde736')
                .setDescription(`User money !set! error:\n\nUser: ${member} \nUser ID: !${userId}!\n\nMoney: !can't be set, wallet is too small!`.replace(/!/g, '`'))

            await interaction.reply({ embeds: [replyEmbed], ephemeral: true })
            return
            }

            if (!ecoData) {
                ecoData = await ecoSchema.create({
                    guildId: guildId,
                    userId: userId,
                    money: value,
                    wallet: 750,
                    multiplayer: 1,
                })
            } else {
                ecoData.money = value
            }

            ecoData.save()

            const replyEmbed = new EmbedBuilder()
                .setTitle('USER MONEY SET')
                .setColor('dde736')
                .setDescription(`User money !set! info:\n\nUser: ${member} \nUser ID: !${userId}!\n\nMoney: !${ecoData.money}/${ecoData.wallet}!`.replace(/!/g, '`'))

            await interaction.reply({ embeds: [replyEmbed], ephemeral: true })
        }
        else if (option === 'add') {
            const member = interaction.options.getMentionable('member')
            const value = interaction.options.getNumber('value')

            const guildId = interaction.guild.id
            const userId = member.id

            let ecoData = await ecoSchema.findOne({ guildId: guildId, userId: userId })
            
            if ((ecoData.money + value) > ecoData.wallet) {
                const replyEmbed = new EmbedBuilder()
                .setTitle('USER MONEY ADD ERROR')
                .setColor('dde736')
                .setDescription(`User money !add! error:\n\nUser: ${member} \nUser ID: !${userId}!\n\nMoney: !can't be added, wallet is too small!`.replace(/!/g, '`'))

            await interaction.reply({ embeds: [replyEmbed], ephemeral: true })
            return
            }

            if (!ecoData) {
                ecoData = await ecoSchema.create({
                    guildId: guildId,
                    userId: userId,
                    money: value,
                    wallet: 750,
                    multiplayer: 1,
                })
            } else {
                ecoData.money += value
            }

            ecoData.save()

            const replyEmbed = new EmbedBuilder()
                .setTitle('USER MONEY ADD')
                .setColor('dde736')
                .setDescription(`User money !add! info:\n\nUser: ${member} \nUser ID: !${userId}!\n\nMoney: !${ecoData.money}/${ecoData.wallet}!`.replace(/!/g, '`'))

            await interaction.reply({ embeds: [replyEmbed], ephemeral: true })
        }
        else if (option === 'remove') {
            const member = interaction.options.getMentionable('member')
            const value = interaction.options.getNumber('value')

            const guildId = interaction.guild.id
            const userId = member.id

            let ecoData = await ecoSchema.findOne({ guildId: guildId, userId: userId })
            
            if ((ecoData.money - value) < 0) {
                const replyEmbed = new EmbedBuilder()
                .setTitle('USER MONEY REMOVE ERROR')
                .setColor('dde736')
                .setDescription(`User money !remove! error:\n\nUser: ${member} \nUser ID: !${userId}!\n\nMoney: !can't be removed, min balance is 0!`.replace(/!/g, '`'))

            await interaction.reply({ embeds: [replyEmbed], ephemeral: true })
            return
            }

            if (!ecoData) {
                ecoData = await ecoSchema.create({
                    guildId: guildId,
                    userId: userId,
                    money: 0,
                    wallet: 750,
                    multiplayer: 1,
                })
            } else {
                ecoData.money -= value
            }

            ecoData.save()

            const replyEmbed = new EmbedBuilder()
                .setTitle('USER MONEY REMOVE')
                .setColor('dde736')
                .setDescription(`User money !remove! info:\n\nUser: ${member} \nUser ID: !${userId}!\n\nMoney: !${ecoData.money}/${ecoData.wallet}!`.replace(/!/g, '`'))

            await interaction.reply({ embeds: [replyEmbed], ephemeral: true })
        }
        else if (option === 'reset') {
            const member = interaction.options.getMentionable('member')

            const guildId = interaction.guild.id
            const userId = member.id

            let ecoData = await ecoSchema.findOne({ guildId: guildId, userId: userId })

            if (!ecoData) {
                ecoData = await ecoSchema.create({
                    guildId: guildId,
                    userId: userId,
                    money: 0,
                    wallet: 750,
                    multiplayer: 1,
                })
            } else {
                ecoData.money = 0
            }

            ecoData.save()

            const replyEmbed = new EmbedBuilder()
                .setTitle('USER MONEY RESET')
                .setColor('dde736')
                .setDescription(`User money !reset! info:\n\nUser: ${member} \nUser ID: !${userId}!\n\nMoney: !${ecoData.money}/${ecoData.wallet}!`.replace(/!/g, '`'))

            await interaction.reply({ embeds: [replyEmbed], ephemeral: true })
        }
    }
}