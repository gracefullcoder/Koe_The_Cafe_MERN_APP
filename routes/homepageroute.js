const express = require('express');
const router = express.Router();
const Heroslider = require("../models/herosection.js");
const Workshop = require("../models/workshop.js");
const Registration = require("../models/registration.js");
const Specialslider = require('../models/specialsection.js');
const Testimonial = require('../models/testimonials.js');
const Event = require("../models/events.js");
const Booking = require("../models/booking.js");
const User = require("../models/user.js");

const { validateRegistration, validateBookings } = require("../middlewares/homepagemiddleware.js");
const { wrapAsync } = require("../utils/wrapAsyncAndExpressError.js")
const { isLogedIn } = require("../middlewares/authmiddlewares.js");

router.get('/', wrapAsync(async (req, res) => {
    let heroSliders = await Heroslider.find();
    let workshop = await Workshop.find();
    let currTime = new Date();
    let isWorkshop = false;
    if(workshop[workshop.length - 1].time > currTime) isWorkshop = true;
    let specialSection = await Specialslider.find();
    let testimonials = await Testimonial.find();
    let events = await Event.find();
    let allSection = { heroSliders, workshop, specialSection, testimonials, events, user: req.user ,isWorkshop:isWorkshop};
    console.log(req.user);
    res.render("homepage/index.ejs", { allSection });
}));

router.post('/', isLogedIn, validateBookings, wrapAsync(async (req, res) => {
    const name = req.body.name;
    const phone = req.body.phone;
    const person = req.body.person;
    const time = req.body.time;
    const date = req.body.reservationdate;
    const message = req.body.message;
    const newbooking = new Booking({ name, phone, person, date, time, message });
    await newbooking.save();
    res.redirect("/");
}));



router.post('/register/:id', isLogedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let flag = true;
    console.log("register");
    req.user.workshops.forEach((workshop) => {
        if (workshop._id == id) {
            flag = false;
            return res.send({ name: req.user.fullname, status: "Already Registered!" });
        }
    })
    if (flag) {
        const { userMessage, userPhone } = req.body;

        const user = await User.findById(req.user._id);
        const workshop = await Workshop.findById(id);
        user.workshops.push(workshop);
        await User.findByIdAndUpdate(req.user._id, user);

        const newRegistration = new Registration({ phoneNumber: userPhone, message: userMessage });
        newRegistration.user = user._id;
        newRegistration.workshop = workshop._id;
        await newRegistration.save();
        workshop.registrations.push(newRegistration);
        await Workshop.findByIdAndUpdate(id, workshop,{new:true});
        res.send({ name: req.user.fullname, status: "Your Registration is Successful!" });
    }
}));


module.exports = router;