const express = require('express');
const router = express.Router();
const Booking = require("../models/booking.js");
const {wrapAsync} = require("../utils/wrapAsyncAndExpressError");

router.get("/", wrapAsync(async (req, res) => {
    let bookings = await Booking.find();
    // console.log(bookings);
    res.render("bookings/bookatable.ejs", { bookings })
}))

router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    id = id.toString();
    let document = await Booking.findByIdAndDelete(id);
    res.redirect("/admin/bookings");
}))

module.exports = router;