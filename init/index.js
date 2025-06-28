
const mongoose = require("mongoose")
const Listing  = require("../models/listing.js")
const initData = require("./data.js");
const Review = require("../models/reviews.js");
// require("dotenv").config();

//  database connection 

mongoose.connect("mongodb+srv://vibhuyadav0061:vibhu@cluster0.ecs0j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(()=>{
 console.log("Database connected successfullt");
}).catch((err)=>{
    console.log(err);
})

//  hear we clear all data -
const initDB =  async()=>{
 await Review.deleteMany({})
//  await Listing.deleteMany({});
//  initData.data = initData.data.map((obj)=>({...obj,owner:'68553e00fc87e17f43f1e759'}));
//  await Listing.insertMany(initData.data);
//  console.log("data set successfully");
}

initDB();