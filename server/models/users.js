// User Document Schema
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const User = new Schema({
    username: { 
        type: String,
        required : true,
        unique: true,
    },
    email: { 
        type: String,
        required : true,
        unique: true,
    },
    password: { 
        type: String,
        required : true,
    },
    reputation: { 
        type: Number,
        default : 0,
    },
    dateJoined: {
        type: Date,
        default: new Date(),
    }
});


module.exports = mongoose.model('User', User);