const express = require('express')
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override')
const ExpressError = require('./utils/ExpressError.js');
const listings = require("./routes/listing.js");
const review = require("./routes/review.js");

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




async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/roamly')
}

app.get("/", (req, res) => {
    res.send("working")
})


app.use("/listings", listings);
app.use("/listings/:id/reviews", review);




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