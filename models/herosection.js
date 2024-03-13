const mongoose = require("mongoose");

const heroSchema = new mongoose.Schema({
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

const Heroslider = mongoose.model("Heroslider", heroSchema);

module.exports = Heroslider;