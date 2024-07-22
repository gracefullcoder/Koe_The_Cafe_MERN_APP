const { google } = require("googleapis");
const nodemailer = require("nodemailer");
require('dotenv').config();

const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.GMAIL_REDIRECTURI
);

oAuth2Client.setCredentials({ refresh_token: process.env.GMAIL_REFRESHTOKEN });

async function sendMail(mailData) {
    try {
        const accessToken = await oAuth2Client.getAccessToken();
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'oAuth2',
                user: 'codingvaibhav247@gmail.com',
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.GMAIL_REFRESHTOKEN,
                accessToken: accessToken
            }
        })

        const result = await transport.sendMail(mailData);
        return result;
    }
    catch (error) {
        console.log(error);
    }
}

// const trialMail= {
//     from:'<codingvaibhav247@gmail.com>',
//     to:'vaibhavgupta10987@gmail.com',
//     subject:"Welcome message",
//     text:"Welcome to my website have a nice day",
//     html:"<h1>Kya bhai kya haal chal hai</h1>"
// }


// sendMail(mailData).then(result => console.log(`mail sent successfully this is result : ${result}`))
// .catch(err => console.log("error bheja ye",err))


module.exports = sendMail;