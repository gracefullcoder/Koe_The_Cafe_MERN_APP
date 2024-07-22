const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require("../config/imagekitconfig.js");
const { showEvents, createEvent, destroyEvent, updateEvent } = require("../controllers/eventsectioncontroller.js")
const upload = multer({ storage: storage });
const { validateEventSection, validateEventEdit } = require("../middlewares/adminmiddlewares.js");
const { wrapAsync } = require("../utils/wrapAsyncAndExpressError");


router.route("/")
    .get(wrapAsync(showEvents))

    .post(upload.single('myFile'), validateEventSection, wrapAsync(createEvent));



router.patch("/edit/:id", upload.single('myFile'), validateEventEdit, wrapAsync(updateEvent));


router.delete("/:id", wrapAsync(destroyEvent))

module.exports = router;