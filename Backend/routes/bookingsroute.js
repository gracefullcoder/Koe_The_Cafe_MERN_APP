const express = require('express');
const router = express.Router();
const { wrapAsync } = require("../utils/wrapAsyncAndExpressError");
const { showAllBookings, destroyBooking, updateBooking } = require("../controllers/bookingcontroller.js");
const { validateBookingUpdate } = require("../middlewares/homepagemiddleware.js");


router.get("/", wrapAsync(showAllBookings));

router.delete("/:id", wrapAsync(destroyBooking));

router.patch("/edit/:id", validateBookingUpdate, wrapAsync(updateBooking));

module.exports = router;