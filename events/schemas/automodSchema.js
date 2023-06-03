const mongoose = require('mongoose');

const automodSchema = mongoose.Schema({
    guildId: {
        type: String,
        required: true
    },
    linkEnabled: {
        type: String,
        required: false
    },
    mentionEnabled: {
        type: String,
        required: false
    },
    emojiEnabled: {
        type: String,
        required: false
    },
    capsEnabled: {
        type: String,
        required: false
    },
    swearEnabled: {
        type: String,
        required: false
    },
});


module.exports = mongoose.model('automods', automodSchema);
