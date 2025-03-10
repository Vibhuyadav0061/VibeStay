const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const listingSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        type:String,
        default:"https://unsplash.com/photos/a-long-exposure-of-a-star-trail-over-the-ocean-EpzoqfX57PQ",
        set:(v)=> v===""? "https://unsplash.com/photos/a-long-exposure-of-a-star-trail-over-the-ocean-EpzoqfX57PQ" : v,
    },
    price:Number,
    location:String,
    country:String,
    

})
const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;