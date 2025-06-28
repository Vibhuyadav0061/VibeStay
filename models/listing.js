const mongoose = require("mongoose");
const reviews = require("./reviews");
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
    reviews: [
        { type: Schema.Types.ObjectId, 
            ref: 'Review'
         },
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:'user',
    }

})
listingSchema.post("findOneAndDelete" , async(listing)=>{
    if(listing){
        await reviews.deleteMany({_id:{$in:listing.reviews}})
    }
})
const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;