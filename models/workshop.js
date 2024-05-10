const mongoose = require("mongoose");

const loginSchema = new mongoose.Schema({
    name: {
      type : String,
      required:true
    },
    email: {
      type : String,
      required:true
    }
  });

const Workshop = mongoose.model("Workshop",loginSchema);

module.exports = Workshop;