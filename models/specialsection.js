const mongoose = require("mongoose");

const specialSchema = new mongoose.Schema({
    label: {
        type: String
    },
    title: {
        type: String
    },
    text: {
        type: String
    },
    image: {
        type: String
    },
    imageid:{
        type:String
    }
});

const Specialslider = mongoose.model("Specialslider", specialSchema);

module.exports = Specialslider;