const { MongoAPIError } = require("mongodb");
const mongoose = require("mongoose");

let testimonialSchema = {
    name:{
        type:String
    },
    profilephoto:{
        type:String
    },
    review:{
        type: String
    },
    imageid:{
        type:String
    }
}

const Testimonial = mongoose.model("Testimonial",testimonialSchema);

module.exports = Testimonial;
