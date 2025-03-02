const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressErr.js");
const {userSchema} = require("../schema.js");
const User = require("../models/user.js");



router.post('/login', async(req, res) =>{
    const {email,password} = req.body;
    console.log(email);
    const users = await User.find({ email:email, password:password});
    console.log(users);
    if(users.length === 0){
        res.redirect('/signup');
    }
   else{ 
         res.redirect('/listings');
   }
    
})

router.post('/signup/user', async(req, res) => {
    const {name,email,contact,password} = req.body.User;
    const user = new User({name,email,contact,password});
    await user.save();
    res.redirect('/');
});

router.get('/signup',(req, res)=>{
    res.render("signup.ejs");
});


router.get('/',(req, res)=>{
    res.render("login.ejs");
});


router.get('/user',async(req, res)=>{
    const user = await User.find({});
    res.render("user.ejs",{user});
});

module.exports = router;