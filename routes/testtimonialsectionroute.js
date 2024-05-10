const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require("../config/imagekitconfig.js");
const { showTestimonials, createTestimonial, destroyTestimonial, renderEditForm, updateTestimonial } = require("../controllers/testimonialsectioncontroller.js")
const upload = multer({ storage: storage });
const {validateTestimonial} = require("../middlewares/adminmiddlewares.js");

router.route("/")
    //get request on testimonials
    .get(showTestimonials)

    //post request on testimonials
    .post(upload.single('myFile'),validateTestimonial, createTestimonial)

router.route("/edit/:id")
    //get request to edit testimonials section
    .get(renderEditForm)

    //patch request on edittestimonials redirect to testimoniasl
    .patch(upload.single('myFile'), updateTestimonial);

//delete request on testimonials page and again redirect to same page
router.delete("/:id", destroyTestimonial)

module.exports = router;