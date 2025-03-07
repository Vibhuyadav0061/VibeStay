
const mongoose = require("mongoose")
const Listing  = require("../models/listing.js")
const initData = require("./data.js")
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
 await Listing.deleteMany({});
 await Listing.insertMany(initData.data);
 console.log("data set successfully")
}

initDB();