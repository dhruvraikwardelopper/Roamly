const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");
const review = require("../models/review.js");

function validateReview(req, res, next) {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let result = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, result);
  }
  next();
}

//post request for reviews
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let review = new Review(req.body.review);
    review.author = req.user._id;
    await review.save();
    listing.reviews.push(review);
    await listing.save();
    req.flash("success", "Review add Successful");

    res.redirect(`/listings/${listing._id}`);
  }),
);

//Delete reviewreq.accepts(types);
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(async (req, res) => {
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
  }),
);

router.put("/:reviewId", isLoggedIn, isReviewAuthor, async (req, res, next) => {
  let { id,reviewId  } = req.params;
    let newreview = await Review.findByIdAndUpdate(
        reviewId,
        {...req.body.review},
        { runValidators: true }
    );
    console.log(newreview)
    req.flash("success", "Review Edited");

    res.redirect(`/listings/${id}`);
})

module.exports = router;
