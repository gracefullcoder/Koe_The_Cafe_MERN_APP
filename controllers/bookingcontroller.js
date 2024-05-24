const User = require("../models/user.js");
const Booking = require("../models/booking.js");


const showAllBookings = async (req, res) => {
    let bookings = await Booking.find();
    // console.log(bookings);
    let currTime = new Date();
    let aheadBookings = [];
    let todayBookings = [];
    let pastBookings = [];

    bookings.forEach((booking) => {
        let bookingTime = booking.time;
        if (currTime > bookingTime && currTime.getDate() != bookingTime.getDate()) {
            pastBookings.push(booking);
        } else if (currTime.getDate() == bookingTime.getDate()) {
            todayBookings.push(booking);
        } else {
            aheadBookings.push(booking);
        }
    })

    res.render("bookings/bookatable.ejs", { aheadBookings, todayBookings, pastBookings });
}


const destroyBooking = async (req, res) => {
    let { id } = req.params;
    id = id.toString();
    let booking = await Booking.findByIdAndDelete(id);
    let data = await User.findByIdAndUpdate(booking.user, { $pull: { bookings: booking._id } }, { new: true });
    console.log(data);
    res.redirect("/");
}

const renderEditForm = async (req, res) => {
    let { id } = req.params;
    let userBooking = await Booking.findById(id);
    console.log(userBooking);
    res.render("bookings/editbookings.ejs", { userBooking });
}


const updateBooking = async (req, res) => {
    let { id } = req.params;
    const { name, phone, person, time, reservationdate, message } = req.body;
    console.log(req.body);

    const combinedTime = new Date(`${reservationdate}T${time}`);
    let acceptedTime = new Date(Date.now() + 4 * 60 * 60 * 1000);
    if (combinedTime < acceptedTime) {
        return res.send(`Booking should be after 4 hours of current Date : 
        ${(acceptedTime.getDate()).toString().padStart(2, '0')}-${(acceptedTime.getMonth() + 1).toString().padStart(2, '0')}-${(acceptedTime.getFullYear())} and 
        current Time ${(acceptedTime.getHours() - 4).toString().padStart(2, '0')}:${(acceptedTime.getMinutes()).toString().padStart(2, '0')}.\n\n
        Next Booking accepted After : ${acceptedTime.getHours().toString().padStart(2, '0')}:${acceptedTime.getMinutes().toString().padStart(2, '0')}.For any Issue You can contact on +91 96246 96846`);
    } else {
        const combinedTime = `${reservationdate}T${time}`;
        const newBookingDetails = { name, phone, person, time: combinedTime, message };
        await Booking.findByIdAndUpdate(id, newBookingDetails);
        res.redirect("/");
    }
}

module.exports = { showAllBookings, destroyBooking, renderEditForm, updateBooking };