const express = require("express");
const router = express.Router();
const Workshop = require("../models/workshop.js");

router.get("/", async (req, res) => {
    let registrations = await Workshop.find();
    console.log(registrations);
    res.render("workshop/workshopregistrations.ejs", { registrations })
})

router.delete("/:id", async (req, res) => {
    let { id } = req.params;
    id = id.toString();
    let document = await Workshop.findByIdAndDelete(id);
    res.redirect("/admin/workshop");
})

module.exports = router;