const mongoose = require('mongoose');

const logSchema = mongoose.Schema({
    guildId: {
        type: String,
        required: true
    },
    channelId: {
        type: String,
        required: false
    },
    enabled: {
        type: String,
        required: false
    },
});


module.exports = mongoose.model('logs', logSchema);
