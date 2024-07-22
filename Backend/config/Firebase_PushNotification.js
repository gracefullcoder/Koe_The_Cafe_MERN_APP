const { GoogleAuth } = require('google-auth-library');
const dotenv = require('dotenv');
const { wrapAsync } = require('../utils/wrapAsyncAndExpressError');

dotenv.config();

// const serviceAccountPath = path.join(__dirname, "koe-the-kafe-firebase-adminsdk-5txh6-a422a2436b.json");

const scopes = ['https://www.googleapis.com/auth/firebase.messaging'];

const generateAccessToken = async function getAccessToken() {
    const auth = new GoogleAuth({
        credentials: {
            client_email:process.env.FIREBASE_CLIENT_EMAIL,
            private_key: process.env.FIREBASE_PRIVATE_KEY,
        },
        scopes: scopes,
    });

    const accessToken = await auth.getAccessToken();
    return accessToken;
};

module.exports = generateAccessToken;

