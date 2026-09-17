const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner } = require("../middleware.js");

function validateListing(req, res, next) {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let result = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, result);
  }
  next();
}

//all listings
router.get(
  "/",
  wrapAsync(async (req, res) => {
    let listings = await Listing.find();
    res.render("./listings/index.ejs", { listings });
  }),
);

//new listing
router.get("/new", isLoggedIn, (req, res) => {
  // console.log(res);
  res.render("./listings/new.ejs");
});
//show listing
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");
    if (!listing) {
      req.flash("error", "This listing does'nt exist");
      return res.redirect("/listings");
    }
    res.render("./listings/show.ejs", { listing });
  }),
);

//create new listing;
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res, next) => {
    let listing = new Listing(req.body.listing);
    listing.owner = req.user._id;
    await listing.save();
    req.flash("success", "New Listing is added");
    res.redirect("/listings");
  }),
);

//edit
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", { listing });
  }),
);

//update route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    let listing = req.body.listing;
    if (!listing) {
      throw new ExpressError(400, "Send Valid data");
    }
    let { id } = req.params;
    listing.owner = req.user._id;
    await Listing.findOneAndReplace({ _id: id }, listing);
    req.flash("success", "Update Successful");

    res.redirect(`/listings/${id}`);
  }),
);

// Delete listing
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndDelete(id);
    req.flash("success", "listing Deleted Successful");
    res.redirect("/listings");
  }),
);

module.exports = router;
