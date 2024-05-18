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
const { showTestimonials, createTestimonial, destroyTestimonial, renderEditForm, updateTestimonial } = require("../controllers/testimonialsectioncontroller.js");
const multer = require('multer');
const { storage } = require("../config/imagekitconfig.js");
const upload = multer({ storage: storage });


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
    let testimonials = await Testimonial.find().populate("user");
    console.log(testimonials);
    let events = await Event.find();
    let allSection = { heroSliders, workshop, specialSection, testimonials, events, user: req.user ,isWorkshop:isWorkshop};
    console.log(req.user);
    res.render("homepage/index.ejs", { allSection });
}));

router.post('/', isLogedIn, validateBookings, wrapAsync(async (req, res) => {
    const { name, phone, person, time, reservationdate: date, message } = req.body;

    // Combine date and time into ISO 8601 format
    const combinedTime = `${date}T${time}`;
    const newbooking = new Booking({ name, phone, person,time:combinedTime, message });
    newbooking.user = req.user._id;
    await newbooking.save();
    let currBookings = req.user.bookings;
    currBookings.push(newbooking);
    await User.findByIdAndUpdate(req.user._id,{bookings:currBookings});
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

router.get("/testimonial",(req,res)=>{
    res.render("homepage/useraddtestimonial.ejs",{user:req.user});
})

router.post("/testimonial",upload.single('myFile'),wrapAsync(createTestimonial));




module.exports = router;