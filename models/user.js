// Purpose: Define the User model schema and export it for use in the application.
const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
       
    },
    email: {
        type: String,  // ✅ Fixed the typo here (was `typer:String`)
        required: true,
        // Optional: Ensures email is stored in lowercase
    },
    contact: {
        type: Number,
        required: true,
        
    },
    password: {
        type: String,
        required: true,
    },
}, { timestamps: true }); // ✅ Adds createdAt & updatedAt fields automatically

const User = mongoose.model("User", userSchema);
module.exports = User;
