const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const reviewController = require("../controller/review.js")
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");

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
  wrapAsync(reviewController.creatingNewReview),
);

//Delete reviewreq.accepts(types);
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.distroyReview),
);

router.put("/:reviewId", isLoggedIn, isReviewAuthor,reviewController.updateReview)

module.exports = router;
