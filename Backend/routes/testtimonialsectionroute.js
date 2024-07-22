const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require("../config/imagekitconfig.js");
const { showTestimonials, createTestimonial, destroyTestimonial, updateTestimonial } = require("../controllers/testimonialsectioncontroller.js")
const upload = multer({ storage: storage });
const { wrapAsync } = require("../utils/wrapAsyncAndExpressError");
const { validateTestimonial } = require("../middlewares/adminmiddlewares.js");

router.route("/")

    .get(showTestimonials)

    .post(upload.single('myFile'), validateTestimonial, wrapAsync(createTestimonial));

router.patch("/edit/:id", validateTestimonial, wrapAsync(updateTestimonial));

router.delete("/:id", wrapAsync(destroyTestimonial))

module.exports = router;