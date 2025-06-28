const express = require('express');
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware');
const router = express.Router({ mergeParams: true });
const userController = require('../controllers/user')
router.get('/signup',wrapAsync(userController.signupRender))
router.post('/signup',wrapAsync(userController.signupUser))

router.get('/signin',wrapAsync(userController.signInRender))

router.post('/signin',saveRedirectUrl,passport.authenticate("local" , {failureRedirect : "/signin" , failureFlash:true}),wrapAsync(userController.signInUser))

router.get("/logout",userController.logout)

module.exports = router;