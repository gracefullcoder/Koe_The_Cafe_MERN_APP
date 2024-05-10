const express = require('express');
const router = express.Router();
const Countdown = require('../models/countdown.js');
const {validateCountdownEdit} = require("../middlewares/adminmiddlewares.js");
router.get("/", async (req, res) => {
    let countdown = await Countdown.find();
    // console.log(countdown);
    res.render("countdownsection/countdownsection.ejs", { countdown })
})


router.patch("/:id",validateCountdownEdit, async (req, res) => {
    let { id } = req.params;
    id = id.toString();
    let { label, title, text, date, time } = req.body;
    label = label.toString();
    title = title.toString();
    time = date.toString() + "T" + time.toString();
    text = text.toString();

    let document = await Countdown.findOneAndUpdate({ _id: id }, { label: label, title: title, time: time, text: text, new: true });
    console.log(document);
    res.redirect("/admin");
});

module.exports = router;