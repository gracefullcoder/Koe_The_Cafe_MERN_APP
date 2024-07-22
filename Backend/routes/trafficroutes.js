const express = require('express');
const router = express.Router();
const { wrapAsync } = require("../utils/wrapAsyncAndExpressError.js");
const User = require("../models/user.js");
const Booking = require("../models/booking.js");
const Mail = require("../models/mailNotification.js");
const Order = require("../models/order.js");
const TrafficAnalysis = require("../models/analytics.js");
const Menu = require("../models/menu.js");
const { isAdmin } = require("../middlewares/adminmiddlewares.js");

router.post("/", wrapAsync(async (req, res) => {
    let activity = req.body;
    console.log(activity);
    let userName = req.user ? req.user.username : 'anonymous';
    const newTraffic = new TrafficAnalysis({ ...activity, userName: userName || "Newly Visited" });
    await newTraffic.save();

    res.status(200).json({ success: true });
}));

router.get("/analytics", isAdmin, wrapAsync(async (req, res) => {

    const users = await User.find().sort({ createdAt: 1 });
    const orders = await Order.find().sort({ createdAt: 1 });
    const mails = await Mail.find();
    const bookings = await Booking.find().sort({ createdAt: 1 });
    const traffic = await TrafficAnalysis.find().sort({ createdAt: 1 });
    const menus = await Menu.find().populate('dishes');
    res.status(200).json({ menus, users, mails, orders, bookings, traffic });
}))


module.exports = router;