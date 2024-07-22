const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    imageid: {
        type: String,
        required: true
    },
    detailsLink: {
        type: String,
        required:true
    }
})

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;