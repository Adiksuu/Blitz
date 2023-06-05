const mongoose = require('mongoose');

const ecoSchema = mongoose.Schema({
    guildId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    money: {
        type: Number,
        required: false
    },
    wallet: {
        type: Number,
        required: false
    },
    multiplayer: {
        type: Number,
        required: false
    },
});


module.exports = mongoose.model('ecos', ecoSchema);
