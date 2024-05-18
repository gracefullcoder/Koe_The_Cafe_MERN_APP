const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  person: {
    type: String,
    required: true
  },
  time:{
    type:Date,
    required:true
  },
  message: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User"
  }
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;