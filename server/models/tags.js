// Tag Document Schema

const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const Tag = new Schema({
    name: { 
        type: String,
        required : true,
        maxlength: 20,
     },
});

 module.exports = mongoose.model('Tag', Tag);