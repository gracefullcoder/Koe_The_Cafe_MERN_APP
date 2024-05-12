const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require("../config/imagekitconfig.js");
const { showTestimonials, createTestimonial, destroyTestimonial, renderEditForm, updateTestimonial } = require("../controllers/testimonialsectioncontroller.js")
const upload = multer({ storage: storage });
const { validateTestimonial } = require("../middlewares/adminmiddlewares.js");
const { wrapAsync } = require("../utils/wrapAsyncAndExpressError");
const { isAdmin } = require("../middlewares/adminmiddlewares.js");

router.route("/")
    //get request on testimonials
    .get(isAdmin, showTestimonials)

    //post request on testimonials
    .post(isAdmin, upload.single('myFile'), validateTestimonial, wrapAsync(createTestimonial))

router.route("/edit/:id")
    //get request to edit testimonials section
    .get(isAdmin, wrapAsync(renderEditForm))

    //patch request on edittestimonials redirect to testimoniasl
    .patch(isAdmin, upload.single('myFile'), wrapAsync(updateTestimonial));

//delete request on testimonials page and again redirect to same page
router.delete("/:id", isAdmin, wrapAsync(destroyTestimonial))

module.exports = router;