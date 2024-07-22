const mongoose = require("mongoose");

const mailNotificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    htmlContent: {
        type: "String",
        required: true
    },

    usersMailId: [
        {
            type: String
        }
    ]
}, {
    timestamps: true
})

const Mail = new mongoose.model("Mail", mailNotificationSchema);

module.exports = Mail;