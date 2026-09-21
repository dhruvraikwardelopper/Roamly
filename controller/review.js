const Review = require("../models/review");
const Listing = require("../models/listing")
//Creating new Review 
module.exports.creatingNewReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let review = new Review(req.body.review);
    review.author = req.user._id;
    await review.save();
    listing.reviews.push(review);
    await listing.save();
    req.flash("success", "Review add Successful");

    res.redirect(`/listings/${listing._id}`);
  }
//delteing the Review
  module.exports.distroyReview  = async (req, res) => {
      let { id, reviewId } = req.params;
      let review = await Review.findById(reviewId);
      if (!review.author._id.equals(req.user._id)) {
        req.flash("error", "Permision denied");
        return res.redirect(`/listings/${id}`);
  
      }
      await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
      await Review.findByIdAndDelete(reviewId);
      req.flash("success", "Review Deleted");
  
      res.redirect(`/listings/${id}`);
    }

    //updating the Review
    module.exports.updateReview =  async (req, res, next) => {
  let { id,reviewId  } = req.params;
    let newreview = await Review.findByIdAndUpdate(
        reviewId,
        {...req.body.review},
        { runValidators: true }
    );
    console.log(newreview)
    req.flash("success", "Review Edited");

    res.redirect(`/listings/${id}`);
}