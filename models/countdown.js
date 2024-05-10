const mongoose = require("mongoose");

countdownSchema = {
    label: {
        type: String,
        required:true
    },
    title: {
        type: String,
        required:true
    },
    time: {
        type: Date,
        required:true
    },
    text: {
        type: String,
        required:true
    }
};

const Countdown = mongoose.model("Countdown", countdownSchema);

module.exports = Countdown;