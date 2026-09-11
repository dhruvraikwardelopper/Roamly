const express = require('express')
const app = express();
const mongoose = require('mongoose');
const Listing = require("./models/listing.js");
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override')
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const listingSchema = require("./schema.js");

// override with POST having ?_method=DELETE
const PORT = 8080;
app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, "/public")))

app.use(express.urlencoded({ extended: true }))
main().then(() => {
    console.log('Connection done')
}).catch(() => {
    console.log(err)
})


function validateListing(req, res, next) {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let result = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, result);
    }
    next();
}
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/roamly')
}

app.get("/", (req, res) => {
    res.send("working")
})

// app.get("/tempListing",async(req,res)=>{
//     let list1 = new Listing({
//         title:"My home",
//         discription:"my Life",
//         price:1200,
//         location:"Atarra",
//         country:"India"
//     });
//    await list1.save();
//    console.log("hello");
//    res.send("ok")
// })


//all listings
app.get("/listings", wrapAsync(async (req, res) => {
    let listings = await Listing.find();
    res.render("./listings/index.ejs", { listings });
}))

//new listing
app.get("/listings/new", (req, res) => {
    // console.log(res);
    res.render("./listings/new.ejs");
})
//show listing
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("./listings/show.ejs", { listing });
}))

//create new listing;
app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {

    let listing = new Listing(req.body.listing);

    await listing.save();
    res.redirect("/listings")

}))

//edit
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", { listing });
}))

//update route 
app.put("/listings/:id",validateListing, wrapAsync(async (req, res) => {
    let listing = req.body.listing;
    if (!listing) {
        throw new ExpressError(400, "Send Valid data");
    }
    let { id } = req.params;
    await Listing.findOneAndReplace({ _id: id }, listing);
    res.redirect(`/listings/${id}`);
}))

// Delete listing
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndDelete(id);

    res.redirect('/listings');
}));


//error middle ware for all worng routes
app.all('/{*splat}', (req, res, next) => {
    next(new ExpressError(404, "Page not found"))
})
// middleware for all error
app.use((err, req, res, next) => {
    let { status = 500, message = "Some thing went worng" } = err;
    // res.status(statusCode).send(msg);
    // console.log(err);
    res.status(status).render("error.ejs", { err })
})



app.listen(PORT, () => {
    console.log("done")
})