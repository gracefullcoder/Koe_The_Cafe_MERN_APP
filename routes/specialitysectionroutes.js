const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require("../config/imagekitconfig.js");
const { showSpecialitySliders, createSpecialitySlider, destroySpecialSlider, renderEditForm, updateSpecialitySlider } = require("../controllers/specialiatysectioncontroller.js")
const upload = multer({ storage: storage });


router.route("/")
  //get request for specialsection route
  .get(showSpecialitySliders)

  //post request on specialsection
  .post(upload.single('myFile'), createSpecialitySlider)



router.route("/edit/:id")
  //get request to edit special section
  .get(renderEditForm)

  //patch request on special redirect to specialsection
  .patch(upload.single('myFile'), updateSpecialitySlider);


//delete request on specialsection page and again redirect to same page
router.delete("/:id", destroySpecialSlider);

