const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup", (req, res) => {
  res.render("./user/signup.ejs");
});

router.post("/signup", async (req, res) => {

    let { username, email, password } = req.body;
    let newUser = new User({
      email,
      username,
    });

    //saving the user to the database
    let user = await User.register(newUser, password);
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "You are sign In");
      res.redirect("/listings");
    });

});

//login route
router.get("/login", (req, res) => {
  res.render("./user/login.ejs");
});

router.post(
  "/login",
  //storing the Original url that user want to access
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "Welcome back your accout is recover");
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
  },
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You logged out successfully");
    res.redirect("/listings");
  });
});
module.exports = router;
