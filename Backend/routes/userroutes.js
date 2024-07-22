const express = require('express');
const router = express.Router();
const {wrapAsync } = require("../utils/wrapAsyncAndExpressError.js");
const multer = require('multer');
const { storage } = require("../config/imagekitconfig.js");
const upload = multer({ storage: storage });
const {previewImage,showUsers,destroyUser,assignAdmin,unAssignAdmin,renderEditForm,updateUser} = require("../controllers/adminusercontroller.js");
const {validateUserUpdate} = require("../middlewares/homepagemiddleware.js");


router.post("/preview",upload.single('myFile'),wrapAsync(previewImage));

router.route("/users")
  .get(wrapAsync(showUsers));

router.route("/users/:id")
  .delete(wrapAsync(destroyUser))

  .patch(wrapAsync(assignAdmin))

router.patch("/removeadmin/:id", wrapAsync(unAssignAdmin))

router.route("/users/edit/:id")
  .get(wrapAsync(renderEditForm))

  .patch(upload.single('myFile'),validateUserUpdate, wrapAsync(updateUser));

module.exports = router;