const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    role :{
        type:String,
        default: "user"
    }
})

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

module.exports = User;
