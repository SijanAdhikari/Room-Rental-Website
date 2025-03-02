const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressErr.js");
const {userSchema} = require("../schema.js");
const newuser = require("../models/newuser.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");


router.get("/login", (req, res) =>{
    res.render("users/newlogin.ejs");
})

router.post("/login",
     passport.authenticate("local", {failureFlash: true, 
        failureRedirect: "/new/login"}), 
        async(req, res) =>{
            req.flash("success", "Welcome back!");
            res.redirect("/listings");
});


router.get("/signup", (req, res) =>{
    res.render("users/newsignup.ejs");
});

router.post("/signup", async (req, res, next) =>{
    try{
    const {username, email, password} = req.body;
    const newUser = new newuser({username, email});
    const registeredUser = newuser.register(newUser, password);
    console.log(registeredUser);
    res.redirect("/listings");
}catch(e){
    req.flash("error", e.message);
    res.redirect("/signup");

}
});

module.exports = router;