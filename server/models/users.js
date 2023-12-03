// User Document Schema

const mongoose = require('mongoose'),
    bcrypt = require(bcrypt);

const Schema = mongoose.Schema;


const User = new Schema({
    username: { 
        type: String,
        required : true,
        maxlength: 20,
     },
    email: {
        type: String,
        required : true,

    },
    password: { 
        type: String, 
        required: true 
    },

});

 module.exports = mongoose.model('User', User);