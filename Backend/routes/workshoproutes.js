const express = require('express');
const router = express.Router();
const Workshop = require('../models/workshop.js');
const {validateWorkShopEdit} = require("../middlewares/adminmiddlewares.js");
const {wrapAsync} = require("../utils/wrapAsyncAndExpressError.js");

router.get("/", wrapAsync(async(req, res) => {
    let workshops = await Workshop.find();
    let currTime = new Date();
    let currWorkshops = [];
    let pastWorkshops = [];

    // time = new Date(time); //agar schema mai string hota tho aise parse karke use karte

    workshops.forEach((workshop) => {
        if(currTime < workshop.time){
            currWorkshops.push(workshop);
        }else{
            pastWorkshops.push(workshop);
        }
    })
    // console.log(workshops);
    res.render("workshop/workshop.ejs", { currWorkshops,pastWorkshops});
}))

router.get("/edit/:id",wrapAsync(async (req,res) => {
    let {id} = req.params;
    let workshopData = await Workshop.findById(id);
    // console.log(workshopData);
    res.render("workshop/editworkshop.ejs",{workshopData});
}))

router.delete("/:id" ,wrapAsync(async (req,res) => {
    let {id} = req.params;
    let workshop = await Workshop.findByIdAndDelete(id);
    // console.log(workshop);
    res.redirect("/admin/workshopsection");
}))

router.post("/",validateWorkShopEdit,wrapAsync(async(req,res) => {
    let { label, title, text, date, time } = req.body;
    // console.log(req.body);
    label = label.toString();
    title = title.toString();
    time = date.toString() + "T" + time.toString(); //T lagana must hai
    text = text.toString();
    let workshopDetails = {label: label, title: title, time: time, text: text};
    let newWorkshop = new Workshop(workshopDetails);
    // console.log(newWorkshop);
    await newWorkshop.save();
    res.redirect("/admin/workshopsection");
}))


router.patch("/edit/:id",validateWorkShopEdit, wrapAsync(async (req, res) => {
    let { id } = req.params;
    id = id.toString();
    let { label, title, text, date, time } = req.body;
    label = label.toString();
    title = title.toString();
    time = date.toString() + "T" + time.toString();
    text = text.toString();
    await Workshop.findOneAndUpdate({ _id: id }, { label: label, title: title, time: time, text: text, new: true });
    res.redirect("/admin/workshopsection");
}));

module.exports = router;