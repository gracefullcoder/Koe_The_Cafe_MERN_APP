const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require("../config/imagekitconfig.js");
const { showSpecialitySliders, createSpecialitySlider, destroySpecialSlider, renderEditForm, updateSpecialitySlider } = require("../controllers/specialiatysectioncontroller.js")
const upload = multer({ storage: storage });
const {validateNewSection,validateEdit} = require("../middlewares/adminmiddlewares.js");
const {wrapAsync} = require("../utils/wrapAsyncAndExpressError");
const {isAdmin} = require("../middlewares/adminmiddlewares.js");

router.route("/")
  //get request for specialsection route
  .get(isAdmin , wrapAsync(showSpecialitySliders))

  //post request on specialsection
  .post(upload.single('myFile'),isAdmin , validateNewSection, wrapAsync(createSpecialitySlider))


router.route("/edit/:id")
  //get request to edit special section
  .get(wrapAsync(renderEditForm))

  //patch request on special redirect to specialsection
  .patch(upload.single('myFile'),isAdmin , validateEdit,wrapAsync(updateSpecialitySlider));


//delete request on specialsection page and again redirect to same page
router.delete("/:id",isAdmin ,  wrapAsync(destroySpecialSlider));

module.exports = router;

