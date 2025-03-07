const express = require('express');
const app = express();
const mongoose = require("mongoose")

const Listing  = require("./models/listing.js")
const path = require("path");
const methodOverride = require("method-override")

const ejsMate = require("ejs-mate")



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

app.get("/listings" , async(req,res)=>{
    let alllistings = await Listing.find({});
    res.render("listings/index" , {alllistings})
})
//  create a new listing 
app.get("/listings/new" , async(req, res)=>{
    res.render("listings/new")
})
//  show listing
app.get("/listings/:id" , async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/show" , {listing});
})

//  crate a post listing rout
app.post("/listings",async(req,res)=>{
    
    const newListing = new Listing(req.body.listing);
    await  newListing.save();
    res.redirect("/listings");
})

// edit the listing
app.get("/listings/:id/edit" ,async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
})

// listing update 
app.put("/listings/:id",async(req,res)=>{
    const {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    
    res.redirect(`/listings/${id}`)
})

// delete route 
app.delete("/listings/:id",async(req,res)=>{
   let {id} = req.params;
   let deletedListing = await Listing.findByIdAndDelete(id);
   console.log(`deleted Listing =   ${deletedListing}`)
   res.redirect('/listings')
})

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
app.listen(PORT,()=>{
    console.log(`server start at port ${PORT}`);
})