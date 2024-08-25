const express = require("express");
const router = express.Router();
const generateAccessToken = require("../config/Firebase_PushNotification.js");
const PushNotification = require("../models/pushnotification.js");
const User = require("../models/user.js");
const { isAdmin } = require("../middlewares/adminmiddlewares.js");
const { wrapAsync } = require("../utils/wrapAsyncAndExpressError.js");

router.post("/send", isAdmin, wrapAsync(async (req, res) => {
    const accessToken = await generateAccessToken();

    const { title, message, icon, link: redirectLink } = req.body;

    console.log(req.body, redirectLink)

    const url = `https://fcm.googleapis.com//v1/projects/koe-the-kafe/messages:send`;
    const notificationKeyUrl = "https://fcm.googleapis.com/fcm/notification?notification_key_name=vaibhavnews";

    // const pushnotificationData = await PushNotification.find({}, { _id: 0, token: 1 });
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
                message: {
                    token: groupKey,
                    notification: {
                        title: title,
                        body: message,
                    },

                    webpush: {
                        fcm_options: {
                            link: redirectLink,
                        }
                    }
                }
            }
        )
    })

    const responseData = await fetchUrl.json();
    // console.log(fetchUrl, "++", responseData);

    res.status(200).json({ success: true, message: "Created Push Notification Successfully" })
}))

router.post("/token", async (req, res) => {
    const { token } = req.body;
    const tokenData = await PushNotification.findOne({ token });
    return tokenData ? res.status(200).json({ token: true }) : res.status(200).json({ token: false });
})

router.post("/:id", wrapAsync(async (req, res) => {
    console.log("push notification is called to save it");
    const { id } = req.params;
    const { token } = req.body;
    console.log(id, token);
    await User.findByIdAndUpdate(id, { $set: { 'notification.pushMessage': 'accept' } }, { new: true });
    const credentials = new PushNotification({ token: token, user: id });
    await credentials.save();


    const accessToken = await generateAccessToken();

    const notificationKeyUrl = "https://fcm.googleapis.com/fcm/notification?notification_key_name=vaibhavnews";

    const fetchKey = await fetch(notificationKeyUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
            "access_token_auth": true,
            "project_id": process.env.FIREBASE_PROJECT_ID
        }
    });

    console.log(notificationKeyUrl);

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
            "notification_key_name": "vaibhavnews",
            "notification_key": groupKey,
            "registration_ids": [token]
        })
    })

    const joinData = await joinGroup.json();

    console.log(joinData, "JOINDATA DETAILS");

    res.status(200).json({ success: true, message: "Thanks To Subscribe for notification!" });
}))

router.post("/group/:name", wrapAsync(async (req, res) => {
    const { name } = req.params;
    const url = `https://fcm.googleapis.com/fcm/notification`;
    const accessToken = await generateAccessToken();

    // const notificationKeyUrl = "https://fcm.googleapis.com/fcm/notification?notification_key_name=vaibhavnews";

    const pushnotificationData = await PushNotification.find({}, { _id: 0, token: 1 });
    const tokens = pushnotificationData.map((Notification) => (Notification.token));
    console.log(tokens);


    const createGroup = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
            "access_token_auth": true,
            "project_id": process.env.FIREBASE_PROJECT_ID
        },
        body: JSON.stringify({
            "operation": "create",
            "notification_key_name": "vaibhavnews",
            "registration_ids": tokens
        })
    })

    const groupDetails = await createGroup.json();
    res.json(groupDetails);
}))


router.post("/tokens/all", wrapAsync(async (req, res) => {

    const pushnotificationData = await PushNotification.find({}, { _id: 0, token: 1 });
    const tokens = pushnotificationData.map((Notification) => (Notification.token));

    res.json(tokens);
}))





module.exports = router;