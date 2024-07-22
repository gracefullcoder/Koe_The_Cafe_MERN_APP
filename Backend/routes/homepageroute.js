const express = require('express');
const router = express.Router();
const { createTestimonial, destroyTestimonial, updateTestimonial } = require("../controllers/testimonialsectioncontroller.js");
const multer = require('multer');
const { storage } = require("../config/imagekitconfig.js");
const upload = multer({ storage: storage });
const { validateRegistration, validateBookingUpdate, validateUserUpdate, validateBooking, validateBookingTiming } = require("../middlewares/homepagemiddleware.js");
const { wrapAsync } = require("../utils/wrapAsyncAndExpressError.js")
const { isLogedIn } = require("../middlewares/authmiddlewares.js");
const { loadMainPage, tableBooking, workshopRegistration, renderUserDashboard, updateUser, showNotifications } = require("../controllers/homepagecontroller.js");
const { destroyBooking, updateBooking } = require("../controllers/bookingcontroller.js");
const { destroyRegistration, updateRegistration } = require("../controllers/registrationcontroller.js");
const { validateTestimonial } = require("../middlewares/adminmiddlewares.js");

router.route("/")
    .get(wrapAsync(loadMainPage))

    .post(isLogedIn, validateBooking, validateBookingTiming, wrapAsync(tableBooking));

router.post('/register/:id', isLogedIn, validateRegistration, wrapAsync(workshopRegistration));


router.post("/testimonial", isLogedIn, upload.single('myFile'), validateTestimonial, wrapAsync(createTestimonial));


router.get("/dashboard", isLogedIn, wrapAsync(renderUserDashboard));

router.patch("/dashboard/edit/:id", isLogedIn, upload.single('myFile'), validateUserUpdate, wrapAsync(updateUser));

router.route("/dashboard/booking/:id")

    .delete(isLogedIn, wrapAsync(destroyBooking))

    .patch(isLogedIn, validateBookingUpdate, wrapAsync(updateBooking))


router.route("/dashboard/registration/:id")

    .delete(isLogedIn, wrapAsync(destroyRegistration))

    .patch(isLogedIn, validateRegistration, wrapAsync(updateRegistration))


router.route("/dashboard/testimonial/:id")

    .delete(isLogedIn, wrapAsync(destroyTestimonial))

    .patch(isLogedIn, validateTestimonial, wrapAsync(updateTestimonial))

router.route("/dashboard/notifications/:id")
    .get(wrapAsync(showNotifications));


module.exports = router;