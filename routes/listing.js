const express = require('express')
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync.js')
const Listing  = require("../models/listing.js")
const {listingSchema} = require('../schema.js')
const ExpressError = require('../utils/ExpressError.js')
const mongoose = require("mongoose")
const ejsMate = require("ejs-mate")
const {isLogedIn} = require("../middleware.js")
const listingsController = require('../controllers/listings.js')

const multer  = require('multer') // multer used for image input in form
const {storage} = require("../configCloudinary.js")
const upload = multer({storage})


const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
     throw new ExpressError(400, errMsg);
    }else{
        next();
    }
} 

router.get("/" ,wrapAsync(listingsController.index))
router.get("/new" ,isLogedIn, wrapAsync(listingsController.newListing))
//  show listing
router.get("/:id" , wrapAsync(listingsController.showListing))

//  create a new listing 

router.post("/",upload.single('listing[image]'),listingsController.createNewListing)

// edit the listing
router.get("/:id/edit",isLogedIn ,wrapAsync(listingsController.editListing))

// listing update 
router.put("/:id", validateListing, upload.single('listing[image]'),wrapAsync(listingsController.updateListing))

// delete route 
router.delete("/:id",wrapAsync(listingsController.destroyListing))
module.exports = router;