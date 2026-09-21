const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

//for all listings
module.exports.index = async (req, res) => {
  let listings = await Listing.find();
  res.render("./listings/index.ejs", { listings });
};

//to render the fomr for new LIsting
module.exports.newListing = (req, res) => {
  // console.log(res);
  res.render("./listings/new.ejs");
};

//To show the listing
module.exports.showListing = async (req, res) => {
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
};

//   creating new Listing
module.exports.createNewListing = async (req, res, next) => {
 let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send()

  let url = req.file.path;
  let filename = req.file.filename;
  let listing = new Listing(req.body.listing);
  listing.owner = req.user._id;
  listing.geometry =  response.body.features[0].geometry

  listing.image = { url, filename };
  await listing.save();
  console.log(listing)
  req.flash("success", "New Listing is added");
  res.redirect("/listings");
};
//render the edit listing form
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  let OriginalUrl = listing.image.url;
  OriginalUrl = OriginalUrl.replace("/upload", "/upload/w_250");
  res.render("./listings/edit.ejs", { listing, OriginalUrl });
};

///updating the Existing listing
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = req.body.listing;
  listing.owner = req.user._id;
  listing = await Listing.findOneAndUpdate({ _id: id }, listing);
  if (typeof req.file !== "undefined") {
    let filename = req.file.filename;
    let url = req.file.path;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Update Successful");
  res.redirect(`/listings/${id}`);
};

//Deleting the Listing
module.exports.distroyListingRoute = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndDelete(id);
  req.flash("success", "listing Deleted Successful");
  res.redirect("/listings");
};
