const mongoose = require("mongoose");

let testimonialSchema = {
    suggestion:{
        type:String
    },
    review: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }
}

const Testimonial = mongoose.model("Testimonial", testimonialSchema);

module.exports = Testimonial;
