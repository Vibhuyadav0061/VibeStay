const Listing = require('../models/listing')
const Review = require('../models/reviews')

module.exports.addReview = async(req , res)=>{
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).send('Listing not found');
    }
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    // console.log(newReview.author)
    await newReview.save();
    // if (!listing.reviews) {
    //   listing.reviews = [];
    // }
    listing.reviews.push(newReview);
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
  
}

module.exports.destroyReview = async(req, res)=>{
let {id , reviewId}  = req.params;
await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId} })
await Review.findByIdAndDelete(reviewId);
res.redirect(`/listings/${id}`)
}