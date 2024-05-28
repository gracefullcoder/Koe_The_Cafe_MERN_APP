const express = require('express');
const router = express.Router();
const {wrapAsync } = require("../utils/wrapAsyncAndExpressError");
const multer = require('multer');
const { storage } = require("../config/imagekitconfig.js");
const upload = multer({ storage: storage });
const {selectSection,showUsers,destroyUser,assignAdmin,unAssignAdmin,notification,renderEditForm,updateUser} = require("../controllers/adminusercontroller.js");
const {validateUserUpdate} = require("../middlewares/homepagemiddleware.js");

router.route("/")
  .get((req, res) => {
    res.render("admindashboard/select.ejs");
  })

  //select page se ispe post and it will redirect ot other pages
  // .post(wrapAsync(selectSection));

router.route("/addadmin")
  .get(wrapAsync(showUsers));

router.route("/addadmin/:id")
  .delete(wrapAsync(destroyUser))

  .patch(wrapAsync(assignAdmin))

router.patch("/removeadmin/:id", wrapAsync(unAssignAdmin))

router.route("/addadmin/edit/:id")
  .get(wrapAsync(renderEditForm))

  .patch(upload.single('myFile'),validateUserUpdate, wrapAsync(updateUser))

router.route("/notification")
  .get(async (req,res) => {
    res.render("admindashboard/notification.ejs");
  })

  .post(wrapAsync(notification))

module.exports = router;