const express = require("express");
const router = express.Router();
const Registration = require("../models/registration.js");
const { wrapAsync } = require("../utils/wrapAsyncAndExpressError.js");
const Workshop = require("../models/workshop.js");
const User = require("../models/user.js");

router.get("/", wrapAsync(async (req, res) => {
    let registrations = await Registration.find().populate("user");
    // console.log("All registrations details called!");
    res.render("workshop/workshopregistrations.ejs", { registrations });
}))


router.route("/:id")
    .get(wrapAsync(async (req, res) => { //workshop ki id hai
        let { id } = req.params;
        console.log(req.params);// app.js wagera params mai aa rahae the network mai dekha 
        let workshopDetails = await Workshop.findById(id).populate({ path: "registrations", populate: { path: "user" } });  //nested populate
        res.render("workshop/workshopdetails.ejs", { workshopDetails });
    }))

    .delete(wrapAsync(async (req, res) => {
        let { id } = req.params;
        let registrationData = await Registration.findByIdAndDelete(id);
        let workshopdata = await Workshop.findByIdAndUpdate(registrationData.workshop,
            {
                $pull: { registrations: registrationData._id }
            }, { new: true });
        // console.log("after update workshop", workshopdata);
        // console.log("deleted regitration ka data", registrationData);
        res.redirect(`/admin/workshopregistration/${workshopdata._id}`);
    }))

module.exports = router;