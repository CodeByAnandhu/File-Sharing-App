const mongoose = require('mongoose');
const { link } = require('../Router/fileShare');

const User = new mongoose.Schema({

    userId: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    }
   
});

const UserSchema = mongoose.model('User', User);

module.exports = UserSchema;
