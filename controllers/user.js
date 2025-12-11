const User = require('../models/user')
const nodemailer = require("nodemailer");
require("dotenv").config();
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
    req.login(registeredUser,async(err)=>{
        if(err){
            return next(err);
        }
        // 📩 Create mail transporter
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // TLS
        auth: {
          user: "yourbro0061@gmail.com",
          pass: process.env.APP_PASS,
        },
      });

      // 📩 Prepare message
      const message = {
        from: "yourbro0061@gmail.com",
        to: email,  // Send to user’s email
        subject: "Welcome to VibeStay!",
        html: `
          <h2>Welcome to VibeStay, ${username}! 🎉</h2>
          <p>We are excited to have you on board.</p>
          <p><b>Your Login Details:</b></p>
          <p>Email: ${email}</p>
          <p>Password: ${password}</p>
          <br/>
          <p>Enjoy exploring VibeStay!</p>
        `,
      };

      // 📩 Send email
      try {
        await transporter.sendMail(message);
        console.log("Signup email sent successfully");
      } catch (mailErr) {
        console.log("Email error: ", mailErr);
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