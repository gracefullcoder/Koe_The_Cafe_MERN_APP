const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require("../config/imagekitconfig.js");
const { showHeroSliders, createHeroSlider, destroyHeroSlider, renderEditForm, updateHeroSlider } = require("../controllers/herosectioncontroller.js")
const upload = multer({ storage: storage });

router.route("/")
  //get request for herosection route
  .get(showHeroSliders)

  //post request on herosection
  .post(upload.single('myFile'), createHeroSlider)



router.route("/edit/:id")
  //get request to edit hero section
  .get(renderEditForm)

  //patch request on /hero/edit redirect to herosection
  .patch(upload.single('myFile'), updateHeroSlider);


//delete request on herosection page and again redirect to same page
router.delete("/:id", destroyHeroSlider);



module.exports = router;