const express = require('express');
const router = express.Router();
const { wrapAsync } = require("../utils/wrapAsyncAndExpressError");
const { showAllBookings, destroyBooking, renderEditForm, updateBooking } = require("../controllers/bookingcontroller.js");
const {validateBookings} = require("../middlewares/homepagemiddleware.js");

router.get("/", wrapAsync(showAllBookings))

router.delete("/:id", wrapAsync(destroyBooking))

router.route("/edit/:id")

    .get(wrapAsync(renderEditForm))

    .patch(validateBookings,wrapAsync(updateBooking))


module.exports = router;