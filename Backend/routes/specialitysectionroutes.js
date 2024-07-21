const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require("../config/imagekitconfig.js");
const { showSpecialitySliders, createSpecialitySlider, destroySpecialSlider, renderEditForm, updateSpecialitySlider } = require("../controllers/specialiatysectioncontroller.js")
const upload = multer({ storage: storage });
const {validateNewSection,validateEdit} = require("../middlewares/adminmiddlewares.js");
const {wrapAsync} = require("../utils/wrapAsyncAndExpressError");

router.route("/")
  //get request for specialsection route
  .get(wrapAsync(showSpecialitySliders))

  //post request on specialsection
  .post(upload.single('myFile') , validateNewSection, wrapAsync(createSpecialitySlider))


router.route("/edit/:id")
  //get request to edit special section
  .get(wrapAsync(renderEditForm))

  //patch request on special redirect to specialsection
  .patch(upload.single('myFile') , validateEdit,wrapAsync(updateSpecialitySlider));


//delete request on specialsection page and again redirect to same page
router.delete("/:id" ,  wrapAsync(destroySpecialSlider));

module.exports = router;

