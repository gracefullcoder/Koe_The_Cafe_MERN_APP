const mongoose = require("mongoose");

const loginSchema = new mongoose.Schema({
    name: String,
    email: String,
  });

const Workshop = mongoose.model("Workshop",loginSchema);

module.exports = Workshop;