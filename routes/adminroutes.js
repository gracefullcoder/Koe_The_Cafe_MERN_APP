let express = require('express');
let router = express.Router();


router.route("/")
  .get(async (req, res) => {
    res.render("admindashboard/select.ejs");
  })

  //select page se ispe post and it will redirect ot other pages
  .post(async (req, res) => {
    let { section } = req.body;
    section = "/admin/" + section.toString().toLowerCase();
    res.redirect(section);
  });

module.exports = router;