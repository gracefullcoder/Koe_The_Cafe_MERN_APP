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
    type: Number,
    required: true,
    min: 1
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  message: {
    type: String,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User"
  },
  seats: {
    type: Array,
    required: true
  }
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;