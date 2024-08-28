const express = require("express");
const router = express.Router();
const generateAccessToken = require("../config/Firebase_PushNotification.js");
const PushNotification = require("../models/pushnotification.js");
const User = require("../models/user.js");
const { isAdmin } = require("../middlewares/adminmiddlewares.js");
const { wrapAsync } = require("../utils/wrapAsyncAndExpressError.js");

router.post("/send", isAdmin, wrapAsync(async (req, res) => {
    const accessToken = await generateAccessToken();

    const { title, message, group, link: redirectLink } = req.body;

    console.log(req.body, redirectLink)

    const url = `https://fcm.googleapis.com//v1/projects/koe-the-kafe/messages:send`;
    const notificationKeyUrl = `https://fcm.googleapis.com/fcm/notification?notification_key_name=${group}`;

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

    const notificationKeyUrl = "https://fcm.googleapis.com/fcm/notification?notification_key_name=vaibhav";

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
            "notification_key_name": "vaibhav",
            "notification_key": groupKey,
            "registration_ids": [token]
        })
    })

    const joinData = await joinGroup.json();

    console.log(joinData, "JOINDATA DETAILS");

    res.status(200).json({ success: true, message: "Thanks To Subscribe for notification!" });
}))

router.get("/group/:name/:token", wrapAsync(async (req, res) => {
    const { name, token } = req.params;
    const url = `https://fcm.googleapis.com/fcm/notification`;
    const accessToken = await generateAccessToken();

    // const notificationKeyUrl = "https://fcm.googleapis.com/fcm/notification?notification_key_name=vaibhav";

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
            "notification_key_name": name,
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


router.get("/remove/:name", wrapAsync(async (req, res) => {
    const { name } = req.params; // Use this if you want to pass group names dynamically
    const url = `https://fcm.googleapis.com/fcm/notification`;
    const accessToken = await generateAccessToken();
    console.log(accessToken);

    const pushnotificationData = await PushNotification.find({}, { _id: 0, token: 1 });
    const tokens = pushnotificationData.map((notification) => notification.token);
    console.log(tokens);

    const notificationKey = await getNotificationKeyByName(name,accessToken); 

    if (!notificationKey) {
        return res.status(404).json({ error: "Notification key not found" });
    }

    // Remove group by sending a request with the "remove" operation
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
            "access_token_auth": true,
            "project_id": process.env.FIREBASE_PROJECT_ID
        },
        body: JSON.stringify({
            "operation": "remove",
            "notification_key_name": name, // Use dynamic name if needed
            "notification_key": notificationKey, // Provide the stored notification key
            "registration_ids": tokens // Pass the tokens you want to remove
        })
    });

    const groupDetails = await response.json();
    res.json(groupDetails);
}));

async function getNotificationKeyByName(name,accessToken) {
    const notificationKeyUrl = `https://fcm.googleapis.com/fcm/notification?notification_key_name=${name}`;

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
    console.log(groupKey);
    return groupKey;
}




module.exports = router;