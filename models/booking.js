const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  name: {
    type : String,
    required:true
  },
  phone: {
    type : Number,
    required:true
  },
  person: {
    type : String,
    required:true
  },
  date: {
    type : String,
    required:true
  },
  time: {
    type : String,
    required:true
  },
  message: {
    type : String,
    required:true
  }
});

const Booking = mongoose.model("Booking",bookingSchema);

module.exports = Booking;