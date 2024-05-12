const { required, object } = require("joi");
const mongoose = require("mongoose");
const { type } = require("os");
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = mongoose.Schema({
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
    role:
    {
        _id: false,
        admin: Boolean,
        creatorname: String,
        creatoremail: String
    }
})

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

module.exports = User;



