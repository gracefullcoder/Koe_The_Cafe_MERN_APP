const mongoose = require('mongoose');

const oauthTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    accessToken: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    },
    tokenType: {
        type: String,
        default: 'Bearer'
    },
    expiryDate: {
        type: Date,
        required: true
    },
}, { timestamps: true });

const OAuthToken = mongoose.model('OAuthToken', oauthTokenSchema);

module.exports = OAuthToken;
