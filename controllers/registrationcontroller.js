const Registration = require("../models/registration.js");
const Workshop = require("../models/workshop.js");
const User = require("../models/user.js");


const showAllRegistration = async (req, res) => {
    let registrations = await Registration.find().populate("user");
    // console.log("All registrations details called!");
    res.render("workshop/workshopregistrations.ejs", { registrations });
}

const workshopRegistration = async (req, res) => { //workshop ki id hai
    let { id } = req.params;
    console.log(req.params);// app.js wagera params mai aa rahae the network mai dekha 
    let workshopDetails = await Workshop.findById(id).populate({ path: "registrations", populate: { path: "user" } });  //nested populate
    res.render("workshop/workshopdetails.ejs", { workshopDetails });
}

const destroyRegistration = async (req, res) => {
    let { id } = req.params;
    let registrationData = await Registration.findByIdAndDelete(id);
    let workshopdata = await Workshop.findByIdAndUpdate(registrationData.workshop,
        {
            $pull: { registrations: registrationData._id }
        }, { new: true });
    // console.log("after update workshop", workshopdata);
    // console.log("deleted regitration ka data", registrationData);
    // res.redirect(`/admin/workshopregistration/${workshopdata._id}`);
    res.redirect("/");
}

const updateRegistration = async (req, res) => {
    let { id } = req.params;
    let { userPhone, userMessage } = req.body;
    console.log(req.body);
    console.log(id);
    await Registration.findByIdAndUpdate(id, { phoneNumber: userPhone, message: userMessage },{new:true});
    res.redirect("/");
}

module.exports = { showAllRegistration, workshopRegistration, destroyRegistration, updateRegistration };