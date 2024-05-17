const mongoose = require("mongoose");
const Registration = require("./registration");
const User = require("./user.js");
const wrapAsync = require("../utils/wrapAsyncAndExpressError.js");
const workshopSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    registrations: [{
        type: mongoose.Schema.ObjectId,
        ref: "Registration"
    }]
});


workshopSchema.post("findOneAndDelete", async (workshopData) => {
    if (workshopData) {
        console.log(workshopData);
        const workshopRegistrations = await workshopData.populate("registrations");
        console.log("haa bhai mai hi hu", workshopRegistrations);
        await Registration.deleteMany({ _id: { $in: workshopData.registrations } });
        console.log(workshopRegistrations.registrations);
        let UserIds = workshopRegistrations.registrations.map((registration) => registration.user); //array bana liya id ka
        console.log("user id", UserIds);
        let delUsers = await User.updateMany({ _id: { $in: UserIds } }, { $pull: { workshops: workshopData._id } });
    }
})

const Workshop = mongoose.model("Workshop", workshopSchema);

module.exports = Workshop;