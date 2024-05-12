const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require("../config/imagekitconfig.js");
const { showHeroSliders, createHeroSlider, destroyHeroSlider, renderEditForm, updateHeroSlider } = require("../controllers/herosectioncontroller.js")
const upload = multer({ storage: storage });
const {validateNewSection,validateEdit} = require("../middlewares/adminmiddlewares.js");
const {wrapAsync} = require("../utils/wrapAsyncAndExpressError");
const {isAdmin} = require("../middlewares/adminmiddlewares.js");


router.route("/")
  //get request for herosection route
  .get(isAdmin,wrapAsync(showHeroSliders))

  //post request on herosection
  .post(upload.single('myFile'), validateNewSection,wrapAsync(createHeroSlider))



router.route("/edit/:id")
  //get request to edit hero section
  .get(wrapAsync(renderEditForm))

  //patch request on /hero/edit redirect to herosection
  .patch(upload.single('myFile'),isAdmin,validateEdit, wrapAsync(updateHeroSlider));


//delete request on herosection page and again redirect to same page
router.delete("/:id",isAdmin, wrapAsync(destroyHeroSlider));



module.exports = router;