const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressErr.js");
const {userSchema} = require("../schema.js");
const User = require("../models/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");


router.get("/login", (req, res) =>{
    res.render("users/newlogin.ejs");
})

router.post("/login",
     passport.authenticate("local", {failureFlash: true, 
        failureRedirect: "/new/login"}), 
        async(req, res) =>{
            req.flash("success", "Welcome back to our rental Portal !!!");
            res.redirect("/listings");
});


router.get("/signup", (req, res) =>{
    res.render("users/newsignup.ejs");
});

router.post("/signup", async (req, res, next) =>{
     try{
      const {username, email, password} = req.body;
      const newUser = new User({username, email});
      const registeredUser = await User.register(newUser, password);
      req.login(registeredUser, err =>{
        if(err) return next(err);
        res.redirect("/listings");
        });
}catch(e){
    req.flash("error", e.message);
    res.redirect("/signup");

}
});

router.get('/user',(req, res) =>{
    // res.send("<h1>Enjoy & utilize the available feature of our Platform , we will implement it ver soon...</h2>");
    res.render("user.ejs");
});

module.exports = router;