const mongoose = require('mongoose');

const ticketSchema = mongoose.Schema({
    guildId: {
        type: String,
        required: true
    },
    categoryId: {
        type: String,
        required: false
    },
});


module.exports = mongoose.model('tickets', ticketSchema);
