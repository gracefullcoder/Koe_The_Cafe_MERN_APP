const { sendMail, getGmailOAuthURL, setGmailCredentials, getGmailClient, oAuth2Client, scope, getTokens, saveTokens } = require("../config/gmail.js");
const express = require("express");
const router = express.Router();
const { wrapAsync, ExpressError } = require("../utils/wrapAsyncAndExpressError.js");
const generateAccessToken = require("../config/Firebase_PushNotification.js");
const PushNotification = require("../models/pushnotification.js");
const Notification = require("../models/notifications.js");
const User = require("../models/user.js");
const Mail = require("../models/mailNotification.js");

router.post("/", (wrapAsync(
    async (req, res) => {
        let { title, message } = req.body;
        let newNotification = new Notification({ title, message });
        await newNotification.save();
        await User.updateMany({}, { $inc: { 'notification.notificationsRemaining': 1 } });
        res.status(200).json({ success: true, message: "Notification Added Successfully !" });
    }
)))

router.post("/mail", wrapAsync(async (req, res, next) => {
    const { title, message, htmlContent, mailUsers } = req.body;

    console.log(req.body);

    if (!htmlContent) {
        return next(new ExpressError(400, "To send mail, please enter some mail content."));
    }

    let googleLoggedinUsers = [];
    if (mailUsers.length === 0) {
        const users = await User.find({ 'federatedCredentials.subject': { $exists: true } }, { _id: 0, username: 1 });
        googleLoggedinUsers = users.map(user => user.username);
    } else {
        const users = await User.find({ username: { $in: mailUsers }, 'federatedCredentials.subject': { $exists: true } }, { _id: 0, username: 1 });
        googleLoggedinUsers = users.map(user => user.username);
    }

    if (googleLoggedinUsers.length === 0) {
        return next(new ExpressError(404, "No valid users found for sending the email."));
    }

    try {
        const mailData = {
            from: 'Koe the Cafe🍵<codingvaibhav247@gmail.com>',
            to: googleLoggedinUsers,
            subject: title,
            text: message,
            html: htmlContent
        };

        await sendMail(mailData);

        res.status(200).json({ success: true, message: "Notification sent successfully!" });
    } catch (error) {
        next(error);
    }
}));

router.get("/auth/gmail", async (req, res) => {
    const userId = req.user._id;
    let tokenData = await getTokens(userId);

    if (!tokenData) {
        const authUrl = await getGmailOAuthURL();
        return res.json({ token: false, url: authUrl });
    }

    setGmailCredentials(tokenData);

    return res.json({ token: true });
})

router.get("/gmail", async (req, res) => {
    const url = await getGmailOAuthURL();
    console.log(url);
    res.json({ authentication: url });
})

router.get('/gmail/callback', async (req, res) => {
    const { code } = req.query;
    const { tokens } = await oAuth2Client.getToken(code);
    console.log(tokens);
    await setGmailCredentials(tokens);
    await saveTokens(req.user._id, tokens);
    res.redirect(`${process.env.FRONTEND_DOMAIN}/admin/notification/email`);
});

router.post("/pushnotification", wrapAsync(async (req, res) => {
    const accessToken = await generateAccessToken();
    console.log("here", accessToken);
    const { title, message } = req.body;

    const url = `https://fcm.googleapis.com//v1/projects/koe-the-kafe/messages:send`;
    const notificationKeyUrl = "https://fcm.googleapis.com/fcm/notification?notification_key_name=news"
    const pushnotificationData = await PushNotification.find({}, { _id: 0, token: 1 });

    // const tokens = pushnotificationData.map((Notification) => (Notification.token));
    // console.log(tokens);

    const fetchKey = await fetch(notificationKeyUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
            "access_token_auth": true,
            "project_id": process.env.FIREBASE_PROJECT_ID
        }
    })

    const responseKey = await fetchKey.json();

    const groupKey = responseKey.notification_key;

    console.log(groupKey)

    const fetchUrl = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify(
            {
                "message": {
                    "token": groupKey,
                    "notification": {
                        "title": title,
                        "body": message
                    }
                }
            }
        )
    })

    const responseData = await fetchUrl.json();
    console.log(fetchUrl, "++", responseData);

    res.status(200).json({ success: true, message: "Created Push Notification Successfully" })
}))

router.post("/:id", wrapAsync(async (req, res) => {
    console.log("push notification is called to save it");
    const { id } = req.params;
    const { token } = req.body;
    console.log(id, token);
    let user = await User.findByIdAndUpdate(id, { $set: { 'notification.pushMessage': 'accept' } }, { new: true });
    const credentials = new PushNotification({ token: token, user: id });
    let data = await credentials.save();


    const accessToken = await generateAccessToken();

    const notificationKeyUrl = "https://fcm.googleapis.com/fcm/notification?notification_key_name=news";

    const fetchKey = await fetch(notificationKeyUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
            "access_token_auth": true,
            "project_id": process.env.FIREBASE_PROJECT_ID
        }
    })

    const responseKey = await fetchKey.json();
    const groupKey = responseKey.notification_key;

    const joinGroup = await fetch(notificationKeyUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
            "access_token_auth": true,
            "project_id": process.env.FIREBASE_PROJECT_ID
        },
        body: JSON.stringify({
            "operation": "add",
            "notification_key_name": "news",
            "notification_key": groupKey,
            "registration_ids": [token]
        })
    })

    const joinData = await joinGroup.json();

    console.log(joinData, "JOINDATA DETAILS");

    // console.log(user, data, "---------------over---------------------------");
    res.status(200).json({ success: true, message: "Thanks To Subscribe for notification!" });
}))


module.exports = router;
