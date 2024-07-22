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
const TrafficAnalysis = require("../models/analytics.js");

const loadMainPage = async (req, res) => {
    console.log("requested to load main page");
    let heroSliders = await Heroslider.find();
    let workshop = await Workshop.findOne().sort({ time: -1 });
    let currTime = new Date();
    let isWorkshop = false;
    if (workshop != {} && workshop.time > currTime) isWorkshop = true;
    let specialSection = await Specialslider.find();
    let testimonials = await Testimonial.find().populate({ path: "user", select: 'fullname profilepicture' }); //after populating selecting only required data
    let events = await Event.find();
    const menus = await Menu.find().populate("dishes");
    let allSection = { heroSliders, menus, workshop, specialSection, testimonials, events, user: req.user, isWorkshop: isWorkshop };
    // console.log(req.user);
    res.status(200).json(allSection);
}

const userAction = async (req, res) => {
    let activity = req.body;
    console.log(activity);
    let userName = req.user ? req.user.username : 'anonymous';
    const newTraffic = new TrafficAnalysis({ ...activity, userName: userName || "Newly Visited" });
    await newTraffic.save();

    res.status(200).json({ success: true });
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
    let flag = true;
    console.log("register");

    let userRegistrations = await req.user.populate("workshopsRegistered");
    console.log(userRegistrations);
    userRegistrations.workshopsRegistered.forEach((registration) => {
        if (registration.workshop == id) {
            flag = false;
            return res.send({ name: req.user.fullname, status: "Already Registered!" });
        }
    })
    if (flag) {
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
        res.send({ name: req.user.fullname, status: "Your Registration is Successful!" });
    }
}


const renderUserDashboard = async (req, res) => {
    let { section } = req.query;
    let userData = await req.user.populate([{ path: "workshopsRegistered", populate: { path: "workshop" } }, "bookings", "testimonial"]);
    let currTime = new Date();
    let pastBookings = [];
    let currBookings = [];
    userData.bookings.forEach((booking) => {
        if (booking.time > currTime) {
            currBookings.push(booking);
        } else {
            pastBookings.push(booking);
        }
    });
    console.log(pastBookings, currBookings);
    // userData.bookings = {pastBookings: pastBookings,currBookings: currBookings };

    let pastWorkshops = [];
    let currWorkshops = [];
    userData.workshopsRegistered.forEach((registration) => {
        if (registration.workshop.time > currTime) {
            currWorkshops.push(registration);
        } else {
            pastWorkshops.push(registration);
        }
    });

    // userData.workshopsRegistered = {pastWorkshops,currWorkshops};

    console.log("user Data", userData);
    let notifications = false;
    if (section == "notifications") {
        let allNotifications = await Notification.find({});
        let oldData = await User.findByIdAndUpdate(userData._id, { notificationRemaining: 0 });
        notifications = { allNotifications, numOfUnread: oldData.notificationRemaining };
    }
    console.log("notifications ", notifications, "section", section);

    res.render("homepage/userdashboard.ejs", { userData, notifications, currBookings, pastBookings, currWorkshops, pastWorkshops });
}

const updateUser = async (req, res) => {
    let { id } = req.params;
    let { fullname, gender, DOB } = req.body;

    console.log(req.file);

    if (!req.file) {
        console.log("idhar brother");
        let document = await User.findByIdAndUpdate(id, { fullname: fullname, gender: gender, DOB: DOB });
        return res.redirect("/dashboard"); //yaha pe else hai nahi tho return lagana must
    }
    else {
        console.log("i m in");
        let myFile = req.file.originalname;
        let fileLocation = path.join("./uploads", myFile);
        fs.readFile(fileLocation, async (err, data) => {
            if (err) throw next(new ExpressError(400, "Please Enter Valid file Name!"));

            imagekit.upload({
                file: data,   //required
                fileName: myFile,   //required
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
                                    throw error; //promise chaining catch and This error will propagate to the next catch block(wrapAsync) 
                                });
                        }
                        fs.unlinkSync(fileLocation);
                        res.redirect("/dashboard");
                    }
                });
        });

    }
}

module.exports = { loadMainPage, userAction, tableBooking, workshopRegistration, renderUserDashboard, updateUser };