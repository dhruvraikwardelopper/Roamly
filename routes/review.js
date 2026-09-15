const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const {reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");



function validateReview(req,res,next){
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let result = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, result);
    }
    next();
}

//post request for reviews
router.post("/",validateReview,wrapAsync(async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let review = new Review(req.body.review);
    await review.save()
    listing.reviews.push(review);
    await listing.save()
    res.redirect(`/listings/${listing._id}`)
}))


//Delete reviewreq.accepts(types);
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
   let r = await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));


module.exports  = router;