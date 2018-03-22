var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var userSchema = new mongoose.Schema({
    username: {
        type: String,
        lowercase: true,
        required: [true, "can't be blank"],
        match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
        index: true
    },
    password: {
        type: String,
        required: true,
    },
    email: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    organnization: { type: String },
    
}, { timestamps: true });

var User = mongoose.model('User', userSchema);

// Async Unique Validation for `username`
User.schema.path('username').validate(async function (value) {
    value = value.toLowerCase();
    console.log('Checking for user: ' + value);
    var user = await User.findOne({ username: value });
    if (user) {
        return false;
    }
}, 'This username is already taken!');

//hash the password before saving it to the database
userSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    })
});

module.exports = User;