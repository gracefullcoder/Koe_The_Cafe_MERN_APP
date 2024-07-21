const express = require('express');
const router = express.Router();
const { createTestimonial, destroyTestimonial, updateTestimonial } = require("../controllers/testimonialsectioncontroller.js");
const multer = require('multer');
const { storage } = require("../config/imagekitconfig.js");
const upload = multer({ storage: storage });
const { validateRegistration, validateBookings,validateUserUpdate ,isTestimonialAdded,redirectAsRole} = require("../middlewares/homepagemiddleware.js");
const { wrapAsync } = require("../utils/wrapAsyncAndExpressError.js")
const { isLogedIn } = require("../middlewares/authmiddlewares.js");
const { loadMainPage, tabelBooking, workshopRegistration, renderTestimonialForm, renderUserDashboard, updateUser } = require("../controllers/homepagecontroller.js");
const { destroyBooking,updateBooking } = require("../controllers/bookingcontroller.js");
const { destroyRegistration, updateRegistration } = require("../controllers/registrationcontroller.js");
const {validateTestimonial} = require("../middlewares/adminmiddlewares.js");

router.route("/")
    .get(wrapAsync(loadMainPage))

    .post(isLogedIn, validateBookings, wrapAsync(tabelBooking))


router.post('/register/:id', isLogedIn,validateRegistration, wrapAsync(workshopRegistration));


router.route("/testimonial")

    .get(isLogedIn,isTestimonialAdded,renderTestimonialForm)

    .post(isLogedIn,upload.single('myFile'),validateTestimonial, wrapAsync(createTestimonial));


router.get("/dashboard",isLogedIn, wrapAsync(renderUserDashboard))

router.patch("/dashboard/edit/:id",isLogedIn,upload.single('myFile'),validateUserUpdate, wrapAsync(updateUser))

router.route("/dashboard/booking/:id")

    .delete(isLogedIn,redirectAsRole,wrapAsync(destroyBooking))

    .patch(isLogedIn,validateBookings,redirectAsRole,wrapAsync(updateBooking))


router.route("/dashboard/registration/:id")

    .delete(isLogedIn,redirectAsRole,wrapAsync(destroyRegistration))

    .patch(isLogedIn,validateRegistration,redirectAsRole,wrapAsync(updateRegistration))


router.route("/dashboard/testimonial/:id")

    .delete(isLogedIn,redirectAsRole,wrapAsync(destroyTestimonial))

    .patch(isLogedIn,validateTestimonial,redirectAsRole,wrapAsync(updateTestimonial))


module.exports = router;