const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');
const {Schema} = mongoose;

const userSchema =new mongoose.Schema({
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
    role: //parent mai poora data one to few
    {
        _id: false,
        admin: Boolean,
        creatorname: String,
        creatoremail: String
    },
    workshops:[
        {
            type:Schema.ObjectId,
            ref:"Worshop"
        }
    ]
})

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

module.exports = User;



