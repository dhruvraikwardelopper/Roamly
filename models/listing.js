const mongoose = require("mongoose");
const Schema  = mongoose.Schema;
const listingSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    image:{
        type:String,
        default:"https://static-cse.canva.com/blob/996499/Sanstitre.jpg",
        set:(v)=>v===" "?"https://static-cse.canva.com/blob/996499/Sanstitre.jpg":v
    },
    price:{
        type:Number,
        default:1500
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    }
});
let Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;