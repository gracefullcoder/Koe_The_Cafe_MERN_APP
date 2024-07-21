const User = require("../models/user.js");
const Booking = require("../models/booking.js");

const showAllBookings = async (req, res) => {
    let bookings = await Booking.find();
    let currTime = new Date();
    let aheadBookings = [];
    let todayBookings = [];
    let pastBookings = [];


    bookings.forEach((booking) => {
        let bookingTime = new Date(`${booking.date}T${booking.time}`);
        if (currTime > bookingTime && currTime.getDate() != bookingTime.getDate()) {
            pastBookings.push(booking);
        } else if (currTime.getDate() == bookingTime.getDate()) {
            todayBookings.push(booking);
        } else {
            aheadBookings.push(booking);
        }
    })

    res.status(200).json({ aheadBookings, todayBookings, pastBookings });
}

const destroyBooking = async (req, res) => {
    let { id } = req.params;
    let booking = await Booking.findById(id);

    await User.findByIdAndUpdate(booking.user, { $pull: { bookings: booking._id } });
    await Booking.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: "Booking Deleted, Our team will call You for Conformation!" });
}

const updateBooking = async (req, res) => {
    let { id } = req.params;
    const { name, phone, message } = req.body;

    const newBookingDetails = { name, phone, message };
    await Booking.findByIdAndUpdate(id, newBookingDetails);
    res.status(200).json({ success: true, message: "Updation Succesfull, we will arrange your booking" });

}

module.exports = { showAllBookings, destroyBooking, updateBooking };