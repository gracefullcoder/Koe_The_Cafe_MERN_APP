const mongoose = require("mongoose");
const { type } = require("os");
const { title } = require("process");

const notificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    }
})

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;