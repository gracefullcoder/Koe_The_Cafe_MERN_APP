const { MongoAPIError } = require("mongodb");
const mongoose = require("mongoose");

let testimonialSchema = {
    name:{
        type:String
    },
    profilephoto:{
        type:String,
        default : "https://ik.imagekit.io/vaibhav11/user.png?updatedAt=1715345414819"
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
