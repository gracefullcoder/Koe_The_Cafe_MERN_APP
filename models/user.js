const { required, number } = require("joi");
const mongoose = require("mongoose");
const { type } = require("os");
const passportLocalMongoose = require('passport-local-mongoose');
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    profilepicture: {
        isUpdated: Boolean,
        imageid: String,
        imagelink: String,
    },
    gender: {
        type: String,
        required: true
    },
    DOB: {
        type: Date,
        required: true
    },
    role: //parent mai poora data one to few
    {
        _id: false,
        admin: Boolean,
        creatorname: String,
        creatoremail: String
    },
    workshopsRegistered: [
        {
            type: Schema.ObjectId,
            ref: "Registration"
        }
    ],
    bookings: [
        {
            type: Schema.ObjectId,
            ref: "Booking"
        }
    ],
    testimonial:
    {
        type: Schema.ObjectId,
        ref: "Testimonial"
    },
    notificationRemaining: {
        type: Number,
        default: 0,
        min:0
    }
})

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

module.exports = User;



