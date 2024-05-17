const mongoose = require("mongoose");
const Workshop = require("./workshop.js");
const User = require("./user.js");
const wrapAsync = require("../utils/wrapAsyncAndExpressError");

const registrationSchema = mongoose.Schema({
  phoneNumber: {
    type: Number,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User"
  },
  workshop: {
    type: mongoose.Schema.ObjectId,
    ref: "Workshop"
  }
});

registrationSchema.post("findOneAndDelete", async (registrationData) => {
  console.log("this is registration daata i m getting", registrationData);
  if (registrationData) {

    //because circular dependency error registration need workshop and workshop needs registration
    // let workshopdata = await Workshop.findByIdAndUpdate(registrationData.workshop,
    //   {$pull:{registrations:registrationData._id}
    // },{new:true});
    // console.log("after update workshop",workshopdata);

    let data = await User.findOneAndUpdate(
      { _id: registrationData.user },
      {
        $pull: { workshops: registrationData.workshop }
      },
      {
        new: true
      }
    );

    console.log("final bhai nai user mai kya update kiya", data);
  }
})

const Registration = mongoose.model("Registration", registrationSchema);

module.exports = Registration;