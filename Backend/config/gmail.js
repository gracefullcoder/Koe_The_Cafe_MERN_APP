const { google } = require("googleapis");
require('dotenv').config();
const OAuthToken = require('../models/oAuthToken');

const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.GMAIL_REDIRECTURI
);

const scope = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send'];

const getGmailOAuthURL = async () => {
    return oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scope,
    });
};

const getGmailClient = () => {
    return google.gmail({ version: 'v1', auth: oAuth2Client });
};

const setGmailCredentials = async (tokenData) => {
    const { accessToken, refreshToken, tokenType, expiryDate, userId } = tokenData;
    const tokens = {
        userId: userId,
        access_token: accessToken,
        refresh_token: refreshToken,
        scope: scope.reduce((acc, val) => acc.concat(val + " "), ""),
        token_type: tokenType,
        expiry_date: expiryDate
    }
    oAuth2Client.setCredentials(tokens);
};

const getTokens = async (userId) => {
    return OAuthToken.findOne({ userId: userId });
};

const saveTokens = async (userId, tokens) => {
    const tokenDoc = new OAuthToken({
        userId: userId,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        tokenType: tokens.token_type,
        expiryDate: new Date(tokens.expiry_date)
    });
    await tokenDoc.save();
};

const updateTokens = async (userId, tokens) => {
    await OAuthToken.findOneAndUpdate(
        { userId: userId },
        {
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            tokenType: tokens.token_type,
            expiryDate: new Date(tokens.expiry_date * 1000)
        },
        { new: true }
    );
};

const refreshAccessToken = async (userId) => {
    try {
        const tokenData = await getTokens(userId);
        if (!tokenData) {
            throw new Error('No tokens found for the user.');
        }
        const { credentials } = await oAuth2Client.refreshToken(tokenData.refreshToken);
        oAuth2Client.setCredentials(credentials);
        await updateTokens(userId, credentials);
    } catch (error) {
        console.error('Error refreshing access token:', error);
        throw error;
    }
};

oAuth2Client.on('tokens', async (tokens) => {
    try {
        if (new Date() > new Date(tokens.expiry_date)) {
            await refreshAccessToken(tokens.userId);
        }
    } catch (error) {
        console.error('Error handling token event:', error);
    }
});

const sendMail = async (mailData) => {
    const gmail = getGmailClient();

    const email = [
        `From: Koe The Cafe <codingvaibhav247@gmail.com>`,
        `Bcc: ${mailData.to.join(', ')}`,
        `Subject: ${mailData.subject}`,
        `Content-Type: text/html; charset=UTF-8`,
        '',
        mailData.html
    ].join('\n');

    const rawMessage = Buffer.from(email)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    try {
        const res = await gmail.users.messages.send({
            userId: 'me',
            requestBody: { raw: rawMessage }
        });
        return res.data;
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};


const welcomeMail = (userName) => {
    return `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Welcome to Koe the Cafe</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                            color: #333;
                        }
                        .container {
                            width: 100%;
                            max-width: 600px;
                            margin: 0 auto;
                            background-color: #ffffff;
                            padding: 20px;
                            border-radius: 8px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            text-align: center;
                            padding-bottom: 20px;
                        }
                        .header img {
                            max-width: 100px;
                        }
                        .content {
                            text-align: left;
                        }
                        .content h1 {
                            color: #D2691E;
                        }
                        .content p {
                            font-size: 16px;
                            line-height: 1.5;
                        }
                        .footer {
                            text-align: center;
                            padding-top: 20px;
                            font-size: 12px;
                            color: #aaa;
                        }
                        .button {
                            display: inline-block;
                            padding: 10px 20px;
                            margin-top: 20px;
                            background-color: #D2691E;
                            color: #ffffff;
                            text-decoration: none;
                            border-radius: 5px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <img src=${"https://ik.imagekit.io/vaibhav11/Koe_Cafe/mail_images/logo1.jpg?updatedAt=1716863831468"} alt="Koe the Cafe Logo">
                        </div>
                        <div class="content">
                            <h1>Welcome, ${userName}!</h1>
                            <p>We're thrilled to have you join us at Koe the Cafe! Thank you for becoming a part of our community. At Koe the Cafe, we're passionate about serving the finest coffee and creating a welcoming atmosphere for all our guests.</p>
                            <p>As a new member, we invite you to explore our range of delicious beverages and treats. Don't forget to check out our special events and workshops designed to bring coffee lovers together.</p>
                            <p>If you have any questions or need assistance, feel free to reach out to our friendly staff at any time. We're here to make your experience at Koe the Cafe memorable.</p>
                            <a href=${"https://admin-koe-the-cafe.onrender.com/"} class="button">Visit Our Website</a>
                            <p>Best Regards,<br>Vaibhav Gupta</p>
                        </div>
                        <div class="footer">
                            <p>&copy; 2024 Koe the Cafe. All rights reserved.</p>
                            <p><a href="#">Unsubscribe</a> from these emails.</p>
                        </div>
                    </div>
                </body>
                </html>`
}

module.exports = { sendMail, getGmailOAuthURL, setGmailCredentials, getGmailClient, oAuth2Client, refreshAccessToken, getTokens, saveTokens, scope,welcomeMail };
