const User = require("../models/user.js");
const Heroslider = require("../models/herosection.js");
const Workshop = require("../models/workshop.js");
const Registration = require("../models/registration.js");
const Specialslider = require('../models/specialsection.js');
const Booking = require("../models/booking.js");
const Testimonial = require('../models/testimonials.js');
const Event = require("../models/events.js");
const path = require("path");
const fs = require('fs');
const { imagekit } = require("../config/imagekitconfig.js");
const Notification = require("../models/notifications.js");
const Menu = require("../models/menu.js");

const loadMainPage = async (req, res) => {
    console.log("requested to load main page");
    let heroSliders = await Heroslider.find();
    let workshop = await Workshop.findOne().sort({ time: -1 });
    let currTime = new Date();
    let isWorkshop = false;
    if (workshop != {} && workshop.time > currTime) isWorkshop = true;
    let specialSection = await Specialslider.find();
    let testimonials = await Testimonial.find().populate({ path: "user", select: 'fullname profilepicture' });
    let events = await Event.find();
    const menus = await Menu.find({available:true}).populate("dishes");
    let allSection = { heroSliders, menus, workshop, specialSection, testimonials, events, user: req.user, isWorkshop: isWorkshop };
    // console.log(req.user);
    res.status(200).json(allSection);
}


const tableBooking = async (req, res) => {
    const { name, phone, person, startTime, date, message, seats } = req.body;
    console.log(req.body);
    let endTime = req.body.endTime;

    if (endTime == '00:00') endTime = '23:59';

    const newbooking = new Booking({ name, phone, person, date, startTime, endTime, message, seats });
    newbooking.user = req.user._id;
    await newbooking.save();
    await User.findByIdAndUpdate(req.user._id, { $push: { bookings: newbooking._id } });
    res.status(200).json({ success: "true", message: "Registration Succesfull🎉, Will reach you soon!" })
}


const workshopRegistration = async (req, res) => {
    let { id } = req.params;
    console.log("register");
    console.log(req.body);
    let userRegistrations = await req.user.populate("workshopsRegistered");
    console.log(userRegistrations);
    userRegistrations.workshopsRegistered.forEach((registration) => {
        if (registration.workshop == id) {
            return res.status(200).json({ message: `You have Already Registered for workshop !`, status: "success" });
        }
    })

    const { userMessage, userPhone } = req.body;

    const user = await User.findById(req.user._id);
    const workshop = await Workshop.findById(id);

    const newRegistration = new Registration({ phoneNumber: userPhone, message: userMessage });
    newRegistration.user = user._id;
    newRegistration.workshop = workshop._id;
    await newRegistration.save();

    user.workshopsRegistered.push(newRegistration);
    await User.findByIdAndUpdate(req.user._id, user);
    workshop.registrations.push(newRegistration);
    await Workshop.findByIdAndUpdate(id, workshop, { new: true });
    res.status(200).json({ message: `${req.user.fullname}, Your Registration is Succesfull🎉!`, status: "success" });
}


const renderUserDashboard = async (req, res) => {
    let userData = await req.user.populate([{ path: "workshopsRegistered", populate: { path: "workshop" } }, "bookings", "testimonial"]);
    let currTime = new Date();
    let pastBookings = [];
    let currBookings = [];
    userData.bookings.forEach((booking) => {
        let hours = booking.startTime.slice(0, 2);
        let miniutes = booking.startTime.slice(3, 5);
        const bookingTime = booking.date.setHours(hours, miniutes, 0);
        if (bookingTime > currTime) {
            currBookings.push(booking);
        } else {
            pastBookings.push(booking);
        }
    });

    let pastWorkshops = [];
    let currWorkshops = [];

    userData.workshopsRegistered.forEach((registration) => {
        if (registration.workshop.time > currTime) {
            currWorkshops.push(registration);
        } else {
            pastWorkshops.push(registration);
        }
    });

    console.log(" requested for dashboard");
    res.status(200).json({ currBookings, pastBookings, currWorkshops, pastWorkshops, testimonial: userData.testimonial });
}

const updateUser = async (req, res) => {
    let { id } = req.params;
    let { fullname, gender, DOB } = req.body;

    console.log(req.file);

    if (!req.file) {
        console.log("idhar brother");
        let userData = await User.findByIdAndUpdate(id, { fullname: fullname, gender: gender, DOB: DOB }, { new: true });
        return res.status(200).json({ success: true, message: "Profile Updated Successfully!", user: userData });
    } else {
        console.log("i m in");
        let myFile = req.file.originalname;
        let fileLocation = path.join("./uploads", myFile);
        fs.readFile(fileLocation, async (err, data) => {
            if (err) throw next(new ExpressError(400, "Please Enter Valid file Name!"));

            imagekit.upload({
                file: data,
                fileName: myFile, 
                folder: "/Koe_Cafe/profilephoto"
            },
                async function (error, result) {
                    if (error) {
                        console.log(error);
                        return next(new ExpressError(406, "Error in Uploading Image!,Add a vallid image."));
                    }
                    else {
                        let image = result.url;
                        let imageid = result.fileId;
                        let profilepicture = {
                            isUpdated: true,
                            imageid: imageid,
                            imagelink: image,
                        }
                        let oldData = await User.findOneAndUpdate({ _id: id }, { fullname: fullname, gender: gender, DOB: DOB, profilepicture: profilepicture });
                        console.log(oldData);
                        if (oldData.profilepicture.isUpdated) {
                            imagekit.deleteFile(oldData.profilepicture.imageid)
                                .then(response => {
                                    console.log(response);
                                })
                                .catch(error => {
                                    console.log(error);
                                    throw error;
                                });
                        }
                        fs.unlinkSync(fileLocation);
                        const userData = await User.findById(id);
                        res.status(200).json({ success: true, message: "Profile Updated Successfully!", user: userData });
                    }
                });
        });

    }
}

const showNotifications = async (req, res) => {
    const { id } = req.params;
    const Notifications = await Notification.find({});
    let user = await User.findByIdAndUpdate(id,
        { $set: { 'notification.notificationsRemaining': 0 } },
        { new: true }
    );
    console.log("called to show all notifications and i made all notifications as read!");
    res.status(200).json({ success: true, message: "Check out our Notifications", Notifications });
}


module.exports = { loadMainPage, tableBooking, workshopRegistration, renderUserDashboard, updateUser, showNotifications };