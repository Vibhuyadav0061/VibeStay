const express = require('express')
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync.js')
const Listing  = require("../models/listing.js")
const Review = require("../models/reviews.js")
const {reviewSchema} = require('../schema.js')
const ExpressError = require('../utils/ExpressError.js')
const mongoose = require("mongoose")
const {isLogedIn,isReviewAuthor}= require("../middleware.js")
const reviewController = require('../controllers/reviews.js')

const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
     throw new ExpressError(400, error);
    }else{
        next();
    }
}

// add new review
router.post("/",isLogedIn,validateReview,wrapAsync(reviewController.addReview))

// review delete
router.delete("/:reviewId" , isLogedIn ,isReviewAuthor,wrapAsync(reviewController.destroyReview))

module.exports = router;