const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require("../config/imagekitconfig.js");
const { showEvents, createEvent, destroyEvent, renderEditForm, updateEvent } = require("../controllers/eventsectioncontroller.js")
const upload = multer({ storage: storage });
const {validateEventSection} = require("../middlewares/adminmiddlewares.js");
const {wrapAsync} = require("../utils/wrapAsyncAndExpressError");
const {isAdmin} = require("../middlewares/adminmiddlewares.js");


router.route("/")
    //get request for events route
    .get(isAdmin,wrapAsync(showEvents))

    //post request on eventsroute
    .post(upload.single('myFile'),isAdmin, validateEventSection,wrapAsync(createEvent))



router.route("/edit/:id")
    //get request to edit events section
    .get(isAdmin,wrapAsync(renderEditForm))

    //patch request on editevents redirect to events route
    .patch(isAdmin,upload.single('myFile'), wrapAsync(updateEvent))


//delete request on eventroute and again redirect to same page
router.delete("/:id",isAdmin, wrapAsync(destroyEvent))

module.exports = router;