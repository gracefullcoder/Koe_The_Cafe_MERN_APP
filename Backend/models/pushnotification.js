const mongoose = require("mongoose");
const { Schema } = mongoose;

const PushNotificationSchema = new Schema({
    token: {
        type: String,
        required: true
    },
    user: {
        type: Schema.ObjectId,
        ref: "User"
    }
})

const PushNotification = mongoose.model("PushNotification",PushNotificationSchema);

module.exports = PushNotification;