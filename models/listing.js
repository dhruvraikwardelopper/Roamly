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
        set:(v)=>v===" "?"https://cdnb.artstation.com/p/marketplace/presentation_assets/003/430/265/large/file.jpg?1706950304":v
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