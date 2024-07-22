const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
    federatedCredentials: {
        provider: String,
        subject: String
    }
    , fullname: {
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
    notification: {
        notificationsRemaining: {
            type: Number,
            default: 0,
            min: 0
        },
        pushMessage: {
            type: String,
            default: "NA"
        }
    },
    cart: [{
        dish: {
            type: Schema.ObjectId,
            ref: "Dish"
        },
        quantity: {
            type: Number,
            default: 0
        }
    }],
    orders: [
        {
            type: Schema.ObjectId,
            ref: "Order"
        }
    ]
}, { timestamps: true })

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

module.exports = User;