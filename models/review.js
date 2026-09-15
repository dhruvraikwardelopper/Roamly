const mongoose = require("mongoose");
const { type } = require("../schema");
const Schema  = mongoose.Schema;

const reviewSchema =new Schema({
    comment:{
        type:String,
        default:"Good"
    },
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default: new Date()
    }
})
module.exports = mongoose.model("Review",reviewSchema);