const mongoose = require('mongoose');

const shopSchema = mongoose.Schema({
    guildId: {
        type: String,
        required: true
    },
    items: {
        type: [Object],
        required: false
    }
})

module.exports = mongoose.model('items', shopSchema)