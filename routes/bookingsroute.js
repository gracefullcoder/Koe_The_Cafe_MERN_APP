const express = require('express');
const router = express.Router();
const Booking = require("../models/booking.js");
const {wrapAsync} = require("../utils/wrapAsyncAndExpressError");
const User = require("../models/user.js");

router.get("/", wrapAsync(async (req, res) => {
    let bookings = await Booking.find();
    // console.log(bookings);
    let currTime = new Date();
    let aheadBookings = [];
    let todayBookings = [];
    let pastBookings = [];

    bookings.forEach((booking)=>{
        let bookingTime = booking.time;
        if(currTime > bookingTime && currTime.getDate() != bookingTime.getDate()){
            pastBookings.push(booking);
        }else if(currTime.getDate() == bookingTime.getDate()){
            todayBookings.push(booking);
        }else{
            aheadBookings.push(booking);
        }
    })

    res.render("bookings/bookatable.ejs", { aheadBookings,todayBookings,pastBookings });
}))

router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    id = id.toString();
    let booking = await Booking.findByIdAndDelete(id);
    let data = await User.findByIdAndUpdate(booking.user,{$pull:{bookings:booking._id}},{new:true});
    console.log(data);
    res.redirect("/admin/bookings");
}))

module.exports = router;