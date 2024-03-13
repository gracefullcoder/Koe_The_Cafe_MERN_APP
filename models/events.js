const mongoose = require("mongoose");

const eventSchema = {
    date: {
        type: String
    },
    image: {
        type: String
    },
    subtitle: {
        type: String
    },
    title: {
        type: String
    },
    imageid: {
        type: String
    }

}

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;