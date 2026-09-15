const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const {listingSchema,reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");



function validateListing(req, res, next) {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let result = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, result);
    }
    next();
}



//all listings
router.get("/", wrapAsync(async (req, res) => {
    let listings = await Listing.find();
    res.render("./listings/index.ejs", { listings });
}))

//new listing
router.get("/new", (req, res) => {
    // console.log(res);
    res.render("./listings/new.ejs");
})
//show listing
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    res.render("./listings/show.ejs", { listing });
}))

//create new listing;
router.post("/", validateListing, wrapAsync(async (req, res, next) => {

    let listing = new Listing(req.body.listing);

    await listing.save();
    res.redirect("/listings")

}))

//edit
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", { listing });
}))

//update route 
router.put("/:id",validateListing, wrapAsync(async (req, res) => {
    let listing = req.body.listing;
    if (!listing) {
        throw new ExpressError(400, "Send Valid data");
    }
    let { id } = req.params;
    await Listing.findOneAndReplace({ _id: id }, listing);
    res.redirect(`/listings/${id}`);
}))

// Delete listing
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
}));



module.exports = router;