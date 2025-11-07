const express = require('express');
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const dotenv = require("dotenv");

const Listing = require("./models/listing.js");
const Review = require("./models/reviews.js");
const User = require('./models/user.js');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const { listingSchema, reviewSchema } = require('./schema.js');
const listingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');

dotenv.config();

const PORT = process.env.PORT || 8000;

// ---------- DATABASE CONNECTION ----------
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("Database connected successfully"))
.catch(err => console.log(err));

// ---------- APP SETUP ----------
app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// ---------- SESSION SETUP ----------
const store = MongoStore.create({
  mongoUrl: process.env.MONGO_URL,
  crypto: {
    secret: "secretCode"
  },
  touchAfter: 24 * 3600, // time period in seconds
});

store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e);
});

const sessionOptions = {
  store,
  secret: "secretCode",
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

// ---------- PASSPORT SETUP ----------
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ---------- GLOBAL MIDDLEWARE ----------
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// ---------- ROUTES ----------
app.use('/listings/:id/reviews', reviewRouter);
app.use('/listings', listingRouter);
app.use('/', userRouter);

app.get("/", (req, res) => {
  res.redirect("/listings");
});

// ---------- ERROR HANDLING ----------
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

// ---------- SERVER START ----------
app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
