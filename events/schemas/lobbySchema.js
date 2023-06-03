const mongoose = require('mongoose');

const lobbySchema = mongoose.Schema({
    guildId: {
        type: String,
        required: true
    },
    lobbyId: {
        type: String,
        required: false
    },
    roleId: {
        type: String,
        required: false
    },
    joinMessage: {
        type: String,
        required: false
    },
    leaveMessage: {
        type: String,
        required: false
    },
});


module.exports = mongoose.model('lobbys', lobbySchema);
