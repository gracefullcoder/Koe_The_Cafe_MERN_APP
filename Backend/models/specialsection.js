const mongoose = require("mongoose");

const specialSchema = new mongoose.Schema({
    label: {
        type: String,
        required:true
    },
    title: {
        type: String,
        required:true
    },
    text: {
        type: String,
        required:true
    },
    image: {
        type: String,
        required:true
    },
    imageid:{
        type:String,
        required:true
    }
});

const Specialslider = mongoose.model("Specialslider", specialSchema);

module.exports = Specialslider;