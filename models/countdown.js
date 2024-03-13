const mongoose = require("mongoose");

countdownSchema = {
    label: {
        type: String
    },
    title: {
        type: String
    },
    time: {
        type: Date
    },
    text: {
        type: String
    }
};

const Countdown = mongoose.model("Countdown", countdownSchema);

module.exports = Countdown;