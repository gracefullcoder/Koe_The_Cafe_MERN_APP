const express = require('express');
const router = express.Router();
const {ExpressError,wrapAsync} = require("../utils/wrapAsyncAndExpressError");
const {isAdmin} = require("../middlewares/adminmiddlewares");

router.route("/")
  .get(isAdmin,(req, res) => {
    res.render("admindashboard/select.ejs");
  })

  //select page se ispe post and it will redirect ot other pages
  .post(isAdmin,wrapAsync(async (req, res) => {
    let { section } = req.body;
    section = "/admin/" + section.toString().toLowerCase();
    res.redirect(section);
  }));

module.exports = router;