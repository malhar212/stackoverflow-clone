// Answer Document Schema
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Answer = new Schema({
    text: { 
        type: String,
        required : true,
    },
    ans_by: {
        type : String,
        required : true,
    },
    ans_date_time: { 
        type: Date, 
        default: Date.now 
    },
});


module.exports = mongoose.model('Answer', Answer);