// Answer Document Schema
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Answer = new Schema({
    text: { 
        type: String,
        required : true,
    },
    qid: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    ans_by: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    ans_date_time: { 
        type: Date, 
        default: Date.now 
    },
    votes: { 
        type: Number,
        default : 0,
    },
    accepted: {
        type: Boolean,
        default: false
    }
});


module.exports = mongoose.model('Answer', Answer);