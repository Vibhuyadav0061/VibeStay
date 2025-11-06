const Listing = require('../models/listing')
module.exports.index = async(req,res)=>{
    let alllistings = await Listing.find({});
    res.render("listings/index" , {alllistings})
}

module.exports.newListing = async(req, res)=>{
    res.render("listings/new")
}

module.exports.createNewListing = async(req,res)=>{
      
       let url = req.file.path;
       let filename = req.file.filename;
    //    console.log(url)
    //    console.log(filename)
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image ={url,filename}
         await  newListing.save();
         req.flash("success","Listing created Successfully")
        res.redirect("/listings");
   
   }

module.exports.showListing = async(req,res)=>{
    let {id} = req.params;
   let listing = await Listing.findById(id).populate({
    path: "reviews",
    populate: { path:"author" }
  }).populate('owner');
    // console.log(listing);
    res.render("listings/show" , {listing});
}   

module.exports.editListing = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    req.flash("success","Listing edited successfully")
    res.render("listings/edit.ejs", {listing});
}

module.exports.updateListing = async(req,res)=>{
    const {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file != "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
    req.flash("success","Listing updated successfully")
    res.redirect(`/listings/${id}`)
}

module.exports.destroyListing = async(req,res)=>{
   let {id} = req.params;
   let deletedListing = await Listing.findByIdAndDelete(id);
   console.log(`deleted Listing =   ${deletedListing}`)
   req.flash("success","Listing deleted successfully")
   res.redirect('/listings')
}