const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require("../config/imagekitconfig.js");
const { showHeroSliders, createHeroSlider, destroyHeroSlider, updateHeroSlider } = require("../controllers/herosectioncontroller.js")
const upload = multer({ storage: storage });
const { validateNewSection, validateEdit } = require("../middlewares/adminmiddlewares.js");
const { wrapAsync } = require("../utils/wrapAsyncAndExpressError");


router.route("/")

  .get(wrapAsync(showHeroSliders))

  .post(upload.single('myFile'), validateNewSection, wrapAsync(createHeroSlider));


router.patch("/edit/:id", upload.single('myFile'), validateEdit, wrapAsync(updateHeroSlider));


router.delete("/:id", wrapAsync(destroyHeroSlider));



module.exports = router;