const mongoose = require('mongoose');

const poolSchema = mongoose.Schema({
    userId: {
        type: String,
        required: false
    },
    messageId: {
        type: String,
        required: true
    },
});


module.exports = mongoose.model('pools', poolSchema);
