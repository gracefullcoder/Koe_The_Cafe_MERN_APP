const express = require('express');
const router = express.Router();
const {ExpressError,wrapAsync} = require("../utils/wrapAsyncAndExpressError");

router.route("/")
  .get((req, res) => {
    res.render("admindashboard/select.ejs");
  })

  //select page se ispe post and it will redirect ot other pages
  .post(wrapAsync(async (req, res) => {
    let { section } = req.body;
    section = "/admin/" + section.toString().toLowerCase();
    res.redirect(section);
  }));

module.exports = router;