const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  name: String,
  phone: Number,
  person: String,
  date: String,
  time: String,
  message: String
});

const Booking = mongoose.model("Booking",bookingSchema);

module.exports = Booking;