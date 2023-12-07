// User Document Schema
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Comment = new Schema({
    text: { 
        type: String,
        required : true,
        maxlength: 140,
    },
    postedBy: { 
        type: Schema.Types.ObjectId,
        required : true,
    },
    associatedObjectType: {
        type: String,
        enum : ['answer', 'question'],
    },
    associatedObjectId: { 
        type: Schema.Types.ObjectId,
        required : true,
    },
    votes: { 
        type: Number,
        default : 0,
    },
    postedDate: {
        type: Date,
        default: Date.now,
    }
});


module.exports = mongoose.model('Comment', Comment);