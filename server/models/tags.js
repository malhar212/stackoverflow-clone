// Tag Document Schema

const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const Tag = new Schema({
    name: { 
        type: String,
        required : true,
        maxlength: 20,
     },
     createdBy: { 
        type: Schema.Types.ObjectId,
        required : true,
    },
});

 module.exports = mongoose.model('Tag', Tag);