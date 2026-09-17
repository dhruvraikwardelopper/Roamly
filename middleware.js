const Listing = require("./models/listing")
const Review = require("./models/review")

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // access the original url that user want to access after the login
    if(req.method==="get"||req.method==="GET"){
    req.session.redirectUrl = req.originalUrl;}
    req.flash("error", "Please logIn first");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  //saving the original url to the locals so that passport can't erase it
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

//creating a middle ware to check the owner 
module.exports.isOwner = async(req,res,next)=>{
      let { id } = req.params;
   let listing = await Listing.findById(id);
   if(!listing.owner._id.equals(req.user._id)){
    req.flash("error"," Permission denied");
    res.redirect(`/listings/${id}`);
   }
   next();
}

module.exports.isReviewAuthor = async(req,res,next)=>{
   let { id, reviewId } = req.params;
      let review = await Review.findById(reviewId);
      if(!review.author._id.equals(req.user._id)){
      req.flash("error", "Permision denied");
      return res.redirect(`/listings/${id}`);
      
      }
      next();
}
