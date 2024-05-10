const mongoose = require("mongoose");

const heroSchema = new mongoose.Schema({
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

const Heroslider = mongoose.model("Heroslider", heroSchema);

module.exports = Heroslider;