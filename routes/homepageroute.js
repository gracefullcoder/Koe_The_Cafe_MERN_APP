const express = require('express');
const router = express.Router();
const Heroslider = require("../models/herosection.js");
const Countdown = require("../models/countdown.js");
const Workshop = require("../models/workshop.js");
const Specialslider = require('../models/specialsection.js');
const Testimonial = require('../models/testimonials.js');
const Event = require("../models/events.js");
const Booking = require("../models/booking.js");

router.get('/', async (req, res) => {
    let heroSliders = await Heroslider.find();
    let countdown = await Countdown.find();
    let specialSection = await Specialslider.find();
    let testimonials = await Testimonial.find();
    let events = await Event.find();
    let allSection = { heroSliders, countdown, specialSection, testimonials, events };
    res.render("homepage/index.ejs", { allSection });
});

router.post('/', async (req, res) => {
    const name = req.body.name;
    const phone = req.body.phone;
    const person = req.body.person;
    const time = req.body.time;
    const date = req.body.reservationdate;
    const message = req.body.message;
    const newbooking = new Booking({ name, phone, person, date, time, message });
    await newbooking.save();
    const popupScript = `
      <script>
        alert("Yeah! ${name} Your Table is Booked!");
      </script>
    `;
    res.redirect("/");
});

router.post('/signup', async (req, res) => {
    try {
        const { userName, userEmail } = req.body;
        const user = await Workshop.find({ email: userEmail });
        if (user.length == 0) {
            const newRegistration = new Workshop({ name: userName, email: userEmail });
            await newRegistration.save();
            res.send({ name: userName, status: "Your Registration is Successful!" });
        } else {
            res.send({ name: userName, status: "Already Registered!" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


module.exports = router;