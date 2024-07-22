const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require("../config/imagekitconfig.js");
const { showSpecialitySliders, createSpecialitySlider, destroySpecialSlider, updateSpecialitySlider } = require("../controllers/specialiatysectioncontroller.js")
const upload = multer({ storage: storage });
const { validateNewSection, validateEdit } = require("../middlewares/adminmiddlewares.js");
const { wrapAsync } = require("../utils/wrapAsyncAndExpressError");

router.route("/")

  .get(wrapAsync(showSpecialitySliders))

  .post(upload.single('myFile'), validateNewSection, wrapAsync(createSpecialitySlider))


router.patch("/edit/:id", upload.single('myFile'), validateEdit, wrapAsync(updateSpecialitySlider))

router.delete("/:id", wrapAsync(destroySpecialSlider));

module.exports = router;