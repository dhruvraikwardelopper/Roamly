const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controller/user.js");
//render signup form //saving the new USer to DB
router
  .route("/signup")
  .get(userController.renderSignUpForm)
  .post(userController.creatingNewUser);

//login route
router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    //storing the Original url that user want to access
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.loginUser,
  );

//logout user
router.get("/logout", userController.logoutUser);
module.exports = router;
