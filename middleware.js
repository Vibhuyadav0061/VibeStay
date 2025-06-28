const Listing = require('./models/listing');
const Review = require('./models/reviews');

module.exports.isLogedIn = (req,res,next)=>{
if(!req.isAuthenticated()){
    req.session.redirectUrl = req.originalUrl;
    req.flash("error","Need to Login")
    return res.redirect("/signin");
}
// console.log("0")
next();

}

module.exports.saveRedirectUrl = (req, res, next)=>{
    if( req.session.redirectUrl){
         res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not Owner")
        return res.redirect(`/listings/${id}`)
    }
    next()
}
module.exports.isReviewAuthor = async(req,res,next)=>{
   
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId).populate("author");
    console.log(review.author._id)
    console.log(res.locals.currUser._id)
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not Author")
        return res.redirect(`/listings/${id}`)
    }
    next()
}