const { ref, required } = require("joi");
const mongoose = require("mongoose");
const {Schema} = mongoose;
const Review = require("./review.js");
const review = require("./review.js");


const ListingSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image: {
        filename: String,
        url: {
          type: String,
          set(value) {
            return value === '' ? "https://www.istockphoto.com/photo/young-woman-checking-her-train-in-time-board-gm628109306-111405847?searchscope=image%2Cfilm" : value;
          }
        }
      },
    price:Number,
    country: String,
    city: String,
    location: {
      type: {
          type: String,
          enum: ['Point'],
          required: true,
      },
      coordinates: {
          type: [Number],
          required : true,
      }
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref: "Review",
    }]
});

ListingSchema.post("findOneAndDelete", async(listing) => {
    if(listing){
        await Review.deleteMany({_id: { $in: listing.reviews } });
    }
})

const Listing = mongoose.model('Listing', ListingSchema);
module.exports = Listing;

