const mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
    user: {
        type: String,
        ref: 'User'
    },
    room: {
        type: String,
        ref: 'Room'
    },
    text: {
        type: String,
        required: true
    },
    isFirst: { type: Boolean }

}, { timestamps: true });

// compound indexes
messageSchema.index({ createdAt: 1, type: -1 });  
// Doesn't take the second argument '{ room: 1 }'
// Created an index on 'createdAt' (sorted in chronological order)
// and on 'room'

var Message = mongoose.model('Message', messageSchema);

module.exports = Message;