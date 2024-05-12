const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require("../config/imagekitconfig.js");
const { showTestimonials, createTestimonial, destroyTestimonial, renderEditForm, updateTestimonial } = require("../controllers/testimonialsectioncontroller.js")
const upload = multer({ storage: storage });
const { validateTestimonial } = require("../middlewares/adminmiddlewares.js");
const { wrapAsync } = require("../utils/wrapAsyncAndExpressError");

router.route("/")
    //get request on testimonials
    .get( showTestimonials)

    //post request on testimonials
    .post( upload.single('myFile'), validateTestimonial, wrapAsync(createTestimonial))

router.route("/edit/:id")
    //get request to edit testimonials section
    .get( wrapAsync(renderEditForm))

    //patch request on edittestimonials redirect to testimoniasl
    .patch( upload.single('myFile'), wrapAsync(updateTestimonial));

//delete request on testimonials page and again redirect to same page
router.delete("/:id", wrapAsync(destroyTestimonial))

module.exports = router;