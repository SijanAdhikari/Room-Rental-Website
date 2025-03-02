const express = require("express");
const router = express.Router({});
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");

// Change the route to handle the root of this router
router.get("/",async (req, res) => {
    const allListing =  await Listing.find({});
    res.render("map.ejs",{allListing});
});

module.exports = router;