const express = require("express");
var flash = require('connect-flash');
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressErr.js");
const {listingSchema} = require("./schema.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const session = require("express-session");
const User = require("./models/user.js");
const schema = require("./schema.js");
const users = require("./routes/users.js");
const map = require("./routes/map.js");
var bodyParser = require('body-parser');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const {isLoggedIn} = require("./middleware.js");




const MONGO_URL = "mongodb://127.0.0.1:27017/Rental";

main()
.then(()=>{ 
    console.log("Connected to data_base");
})
.catch((err) => {
    console.log(err);
}); 

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessonOptions = {
    secret:"mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires:Date.now()+ 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly:true,
    }

}
app.use(session(sessonOptions));
app.use(flash());
app.use((req, res, next )=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.user= req.user;
    next();
})

app.use(passport.initialize());
app.use(passport.session());  
passport.use( new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/map", map)
app.use("/new", users);







app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!!!"));
});
app.use((err, req ,res, next) =>{
    let {statusCode=406, message="Something went wrong!!!"} = err;
     res.render("listings/error.ejs",{statusCode,message});
     
});

app.listen(8080,() =>{
    console.log("Hi I am testing server connection confirmation");
});

