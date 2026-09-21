const mongoose = require("mongoose");
const Review = require("./review");
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
      url:String,
      filename:String
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
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner : {
        type:Schema.Types.ObjectId,
        ref:"User",
    },

    //storing the cordinate in the data base 
    geometry:{
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}})
    }
})

let Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;