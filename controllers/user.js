const User = require('../models/user')
module.exports.signupRender = async(req, res)=>{
    try{
       res.render('user/signup.ejs')
    }
    catch(e){
        req.flash("error",e.message);
    }
}


module.exports.signupUser = async(req, res)=>{
    try{
        const {username , email , password} = req.body;
    let newUser = new User({email,username});
    const registeredUser = await User.register(newUser,password);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
         req.flash("success","Welcome to VibeStay")
         res.redirect('/listings')
    })

   
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect('/signup')
    }
}

module.exports.signInRender = async(req, res)=>{
    try{
       res.render('user/signin.ejs')
    }
    catch(e){
        req.flash("error",e.message);
    }
}

module.exports.signInUser =  async(req, res)=>{
    try{
        // const {email , password} = req.body;
        // const user = await User.findOne({email});
        // if(user){
        //     console.log(user.username)
        // }
        // // console.table({email , password})
        req.flash("success","Welcome to VibeStay")
        let redirectUrl = res.locals.redirectUrl || '/listings' ;
        console.log(redirectUrl)
        if(req.method !== "GET"){
            return res.redirect('/listings')
        }
        res.redirect(redirectUrl)
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect('/signin')
    }
}

module.exports.logout = (req,res)=>{
req.logout((err)=>{
    if(err){
      console.log(err);
    }
    req.flash("success","LogOut Successfully")
res.redirect("/listings")
})
}