const express = require("express");
require('dotenv').config();
const mongoose = require("mongoose");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressErr.js");
const {listingSchema} = require("../schema.js");
const {reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const multer  = require('multer');
// const upload = multer({ dest: 'uploads/' })
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { ref } = require("joi");
const Review = require("../models/review.js");
const  bodyParser = require('body-parser');
const {Schema} = mongoose;
const flash = require("connect-flash");
const session = require("express-session")


cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "wanderlust", // Change folder name as needed
      allowed_formats: ["jpg", "jpeg", "png"],
    },
  });

  const upload = multer({ storage: storage });

const validateListing = (req, res, next) =>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(600,errMsg);
    }else{
        next();
    }
} 
// index route
router.get('/', wrapAsync(async (req,res) => {
    const allListing =  await Listing.find({});
    res.render("listings/index.ejs",{allListing});
}));
// new route
router.get('/new', (req, res) => {
    res.render("listings/new.ejs");
});
// show route 
router.get('/:id',wrapAsync(async(req, res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate('reviews'); 
    res.render("listings/show.ejs",{ listing });
}));
//post route
router.post("/",
upload.single('image'),
    async(req, res, next) =>{
        try {
            // Upload image to Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path);
    
            // Create new listing and set the image URL
            const newListing = new Listing({
                ...req.body.listing,
                image:{url:result.secure_url } // Save Cloudinary image URL in MongoDB
            });
    
           await newListing.save();
            res.redirect("/listings");
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
 }
); 
//  update route
router.put("/:id",wrapAsync( async (req, res) => {
    if(!req.body.listing){
        throw new ExpressError(400,"Send Valid Data for Listings");
    }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`${id}`);
})); 


// edit route
router.get("/:id/edit", wrapAsync(async(req, res) => {
    let {id} =req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

//delete route
router.delete("/:id", wrapAsync(async(req, res)=>{
    let {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    res.redirect("/listings");
}));

module.exports = router;