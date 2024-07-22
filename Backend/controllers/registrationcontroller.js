const Registration = require("../models/registration.js");
const Workshop = require("../models/workshop.js");
const User = require("../models/user.js");


const showAllRegistration = async (req, res) => {
    let registrations = await Registration.find().populate("user");
    res.render("workshop/workshopregistrations.ejs", { registrations });
}

const workshopRegistration = async (req, res) => { //workshop ki id hai
    let { id } = req.params;

    let workshopDetails = await Workshop.findById(id, 'registrations').populate({ path: "registrations", select: 'phoneNumber message', populate: { path: "user", select: 'username fullname' } });  //nested populate
    res.status(200).json(workshopDetails.registrations);
}

const destroyRegistration = async (req, res) => {
    let { id } = req.params;
    let registrationData = await Registration.findByIdAndDelete(id);
    let workshopdata = await Workshop.findByIdAndUpdate(registrationData.workshop,
        {
            $pull: { registrations: registrationData._id }
        }, { new: true });
    
    res.status(200).json({ success: true, message: "Registration Cancelled!" });
}

const updateRegistration = async (req, res) => {
    let { id } = req.params;
    console.log("registrration update");
    let { userPhone, userMessage } = req.body;
    
    await Registration.findByIdAndUpdate(id, { phoneNumber: userPhone, message: userMessage }, { new: true });
    res.status(200).json({ success: true, message: "Registration Details Updated Succesfully 🎉" });
}

module.exports = { showAllRegistration, workshopRegistration, destroyRegistration, updateRegistration };