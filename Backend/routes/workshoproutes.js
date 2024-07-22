const express = require('express');
const router = express.Router();
const Workshop = require('../models/workshop.js');
const { validateWorkShopEdit } = require("../middlewares/adminmiddlewares.js");
const { wrapAsync } = require("../utils/wrapAsyncAndExpressError.js");

router.get("/", wrapAsync(async (req, res) => {
    let workshops = await Workshop.find();
    let currTime = new Date();
    let currWorkshops = [];
    let pastWorkshops = [];

    workshops.forEach((workshop) => {
        if (currTime < workshop.time) {
            currWorkshops.push(workshop);
        } else {
            pastWorkshops.push(workshop);
        }
    })
    res.status(200).json({ currWorkshops, pastWorkshops });
}))

router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let workshop = await Workshop.findByIdAndDelete(id);
    res.status(200).json({success:true,message:"Workshop Deleted Successfully!"})
}))

router.post("/", validateWorkShopEdit, wrapAsync(async (req, res) => {
    let { label, title, text, date, time } = req.body;
    label = label.toString();
    title = title.toString();
    time = date.toString() + "T" + time.toString();
    text = text.toString();
    let workshopDetails = { label: label, title: title, time: time, text: text };
    let newWorkshop = new Workshop(workshopDetails);
    await newWorkshop.save();
    res.status(200).json({success:true,message:"Workshop Added Successfully"})
}))


router.patch("/edit/:id", validateWorkShopEdit, wrapAsync(async (req, res) => {
    console.log("edit workshop")
    let { id } = req.params;
    id = id.toString();
    let { label, title, text, date, time } = req.body;
    label = label.toString();
    title = title.toString();
    time = date.toString() + "T" + time.toString();
    text = text.toString();
    await Workshop.findOneAndUpdate({ _id: id }, { label: label, title: title, time: time, text: text, new: true });
    res.status(200).json({success:true,message:"Workshop Updated Successfully"})
}));

module.exports = router;