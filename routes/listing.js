const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require("../controller/listing.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({storage })

function validateListing(req, res, next) {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let result = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, result);
  }
  next();
}

//allListing & create new listing;

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    validateListing,
    upload.single('listing[image]'),
    wrapAsync(listingController.createNewListing),
  );

//new listing
router.get("/new", isLoggedIn, listingController.newListing);
//show listing , update Listing and Delete Listing
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    // validateListing,
    wrapAsync(listingController.updateListing),
  )
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.distroyListingRoute),
  );

//edit
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm),
);

module.exports = router;
