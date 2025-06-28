const express = require('express');
const app = express();
const mongoose = require("mongoose")

const Listing  = require("./models/listing.js")
const Review = require("./models/reviews.js")
const path = require("path");
const methodOverride = require("method-override")

const ejsMate = require("ejs-mate")
const wrapAsync = require('./utils/wrapAsync.js')
const ExpressError = require('./utils/ExpressError.js')
const {listingSchema , reviewSchema} = require('./schema.js')
const listingRouter = require('./routes/listing.js')
const reviewRouter = require('./routes/review.js')
const userRouter = require('./routes/user.js')
const session = require('express-session')
const flash = require('connect-flash')

const passport = require('passport');
const LocalStrategy = require('passport-local')
const User = require('./models/user.js')


require("dotenv").config();
app.use(express.json());  
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")))

const PORT = process.env.PORT || 8000;                  

//  database connection 

mongoose.connect(process.env.MONGO_URL)
.then(()=>{
 console.log("Database connected successfullt");
}).catch((err)=>{
    console.log(err);
})


// ejs setup 
app.set("view engine" , "ejs");
app.set("views",path.join(__dirname, "views"));

const sessionOptions = {
 secret:"secreatCode",
 resave:false, 
 saveUninitialised:true,
 cookie:{
    expires:Date.now()+1*24*60*60*1000,
    maxAge:1*24*60*60*1000,
    httpOnly:false,
 },
}
app.use(session(sessionOptions))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    
    next();
})

// make a demo user

app.get("/demouser",async(req, res)=>{
    let fakeuser = new User({
        email:"yadav@getMaxListeners.com",
        username:"yadav"
    })
    let newUser = await User.register(fakeuser,"123456");
    res.send(newUser);
    // register method make sure the unique username 
})




// const validateListing = (req,res,next)=>{
//     let {error} = listingSchema.validate(req.body);
    
//     if(error){
//         let errMsg = error.details.map((el)=>el.message).join(",");
//      throw new ExpressError(400, error);
//     }else{
//         next();
//     }
// }

// const validateReview = (req,res,next)=>{
//     let {error} = reviewSchema.validate(req.body);
    
//     if(error){
//         let errMsg = error.details.map((el)=>el.message).join(",");
//      throw new ExpressError(400, error);
//     }else{
//         next();
//     }
// }


app.use('/listings/:id/reviews' , reviewRouter);
app.use('/listings' , listingRouter);
app.use('/',userRouter);
// app.get("/listings" , wrapAsync(async(req,res)=>{
//     let alllistings = await Listing.find({});
//     res.render("listings/index" , {alllistings})
// }))
//  create a new listing 
// app.get("/listings/new" , wrapAsync(async(req, res)=>{
//     res.render("listings/new")
// }))
// //  show listing
// app.get("/listings/:id" , wrapAsync(async(req,res)=>{
//     let {id} = req.params;
//     let listing = await Listing.findById(id).populate("reviews");
//     res.render("listings/show" , {listing});
// }))

//  crate a post listing rout
// there we pass validate listing function as a middleware so when any request comes that fuction runs or validate 1st.
// app.post("/listings", validateListing,wrapAsync(async(req,res)=>{
       
//         const newListing = new Listing(req.body.listing);
//          await  newListing.save();
//         res.redirect("/listings");
   
//    }))

// // edit the listing
// app.get("/listings/:id/edit" ,wrapAsync(async(req,res)=>{
//     let {id} = req.params;
//     const listing = await Listing.findById(id);
//     res.render("listings/edit.ejs", {listing});
// }))

// // listing update 
// app.put("/listings/:id", validateListing,wrapAsync(async(req,res)=>{
//     const {id} = req.params;
//     await Listing.findByIdAndUpdate(id,{...req.body.listing});
    
//     res.redirect(`/listings/${id}`)
// }))

// // delete route 
// app.delete("/listings/:id",wrapAsync(async(req,res)=>{
//    let {id} = req.params;
//    let deletedListing = await Listing.findByIdAndDelete(id);
//    console.log(`deleted Listing =   ${deletedListing}`)
//    res.redirect('/listings')
// }))

//  api check ?


// app.get('/listingcheck', async(req, res)=>{
//     let samplelisting = new Listing({
//         title:"My Vila",
//         price:3000,
//         country:"India",
//     })
//     await samplelisting.save();
//     res.send("listing successfully")
// })

// app.get('/',(req,res)=>{
//     res.send("Radhe Radhe");
// })


// Reviews 
// app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req , res)=>{
//     const listing = await Listing.findById(req.params.id);

//     if (!listing) {
//       return res.status(404).send('Listing not found');
//     }

//     const newReview = new Review(req.body.review);
//     await newReview.save();

//     // if (!listing.reviews) {
//     //   listing.reviews = [];
//     // }

//     listing.reviews.push(newReview);
//     await listing.save();

//     res.redirect(`/listings/${listing._id}`);
  
// }))

// // review delete
// app.delete("/listings/:id/reviews/:reviewId" , async(req, res)=>{
// let {id , reviewId}  = req.params;
// await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId} })
// await Review.findByIdAndDelete(reviewId);
// res.redirect(`/listings/${id}`)

// })


app.get("*" , (req, res,next)=>{
    next(new ExpressError(404 , "Page Not Found !"));
})
app.use((err, req , res , next)=>{
    const {statusCode = 500 , message = "Something went wrong"} = err;
    res.status(statusCode).render('error.ejs' ,{message});
    // res.send("something is wrong ");
})
app.listen(PORT,()=>{
    console.log(`server start at port ${PORT}`);
})