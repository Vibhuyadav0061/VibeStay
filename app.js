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
const MongoStore = require('connect-mongo');
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
app.use(session({
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URL })
}));



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

app.use('/listings/:id/reviews' , reviewRouter);
app.use('/listings' , listingRouter);
app.use('/',userRouter);


app.get("/", (req, res) => {
  res.redirect("/listings");
});
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