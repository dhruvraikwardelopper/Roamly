require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listing.js");
const review = require("./routes/review.js");
const user = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo').default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const dbUrl = process.env.ATLASDB_URL
// override with POST having ?_method=DELETE
const PORT = 8080;
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

app.use(express.urlencoded({ extended: true }));
main()
  .then(() => {
    console.log("Connection done");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

// app.get("/", (req, res) => {
//   res.send("working");
// });



//Creating new session so that session info stored inn the mongodb Atlas
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto:{
    secret:"mysuperkey",
  },
  touchAfter: 24*3600,
})

store.on("error",()=>{
  console.log("ERROR on MONGO Session Store",err);
})


//iniliaing the session option for session
const sessionOption = session({
  store,
  secret: "mysuperkey",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: new Date() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    //to prevent cross Scripting aatacks
    httpOnly: true,
  },
});




//applying the sesstion in the app;
app.use(sessionOption);
app.use(flash());

//applying the passport verification to authonticate the user
app.use(passport.initialize());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.msg = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// app.use("/demoUser",async(req,res)=>{
//     let newUser = new User({
//         email:'random@gmail.com',
//         username:"random-user",
//     })
//     let resisteredUser = await User.register(newUser,"123");
//     res.send(resisteredUser)
// })

app.use("/listings", listings);
app.use("/listings/:id/reviews", review);
app.use("/", user);

//error middle ware for all worng routes
app.all("/{*splat}", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});
// middleware for all error
app.use((err, req, res, next) => {
  let { status = 500, message = "Some thing went worng" } = err;
  // res.status(statusCode).send(msg);
  // console.log(err);
  res.status(status).render("error.ejs", { err });
});

app.listen(PORT, () => {
  console.log("done");
});
