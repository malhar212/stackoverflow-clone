// Question Document Schema
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Question = new Schema({
    title: {
        type : String,
        // unique : true,
        required : true,
        maxlength: 100,
    },
    text: {
        type : String,
        // unique : true,
        required : true,
    },
    tags: {
        type: [Schema.Types.ObjectId], 
        default: [],
        validate: {
            validator: function(arr) {
                return arr.length <= 5;
            },
            message: "Cannot have more than 5 tags"
        }
    },
    answers : {
      type : [Schema.Types.ObjectId],
      default : [], 
      required : true,  
    },
    asked_by : {
        type: Schema.Types.ObjectId,
        required: true,
    },
    ask_date_time : { 
        type : Date,
        default : Date.now,
    },
    views: {
        type : Number,
        default : 0,
     }
});


module.exports = mongoose.model('Question', Question);