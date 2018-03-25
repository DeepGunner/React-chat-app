var mongoose = require('mongoose');
var generateId = require('shortid').generate;

var roomSchema = mongoose.Schema({
    channel_id: {
        type: String,
        unique: true,
        default: generateId
    },
    // Exists for a channel
    // else, undefined for private chats
    name : {
        type: String,
        sparse: true,
        unique: true,
        trim: true
    },
    users : {
        type: Array,
        ref: 'User'
    },
    owner: {
        type: String,
        ref: 'User'
    },
    // For channels
    isPublic: {
        type: Boolean
    }
}, { timestamps: true });

var Room = mongoose.model('Room', roomSchema);

module.exports = Room;