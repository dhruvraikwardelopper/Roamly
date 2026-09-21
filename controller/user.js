const User = require("../models/user.js");
//render signup form
module.exports.renderSignUpForm = (req, res) => {
  res.render("./user/signup.ejs");
}


//Creating new User
module.exports.creatingNewUser =  async (req, res) => {

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

}

//rendering the Login page
module.exports.renderLoginForm = (req, res) => {
  res.render("./user/login.ejs");
}

//Login User
module.exports.loginUser = async (req, res) => {
    req.flash("success", "Welcome back your accout is recover");
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
  }

  //logout User
  module.exports.logoutUser =  (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You logged out successfully");
    res.redirect("/listings");
  });
}