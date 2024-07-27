import React from 'react';
import { toastMessage } from '../../../helperfunction';

function BookingForm({ booking, index, makeChange, setUserBookings }) {
    const invalidUpdate = () => {
        toastMessage({ success: false, message: "Can't Update this field, Delete this booking and create new Booking." });
    }

    function handleBookingChange(event,index) {

        setUserBookings((prevData) => {
            const updatedCurrBookings = prevData.currBookings.map((booking, idx) => {
                if (index === idx) {
                    return { ...booking, [event.target.name]: event.target.value };
                }
                return booking;
            });

            return { currBookings: updatedCurrBookings };
        });
    }
    return (
        <form>
            <h2 className="activity-number">Booking {index + 1}</h2>
            <div className="activity-detail-field">
                <h3 className="activity-detail-label">Name:</h3>
                <input
                    type="text"
                    className="user-input"
                    name="name"
                    value={booking.name}
                    disabled={makeChange === index ? false : true}
                    onChange={(event) => handleBookingChange(event,index)}
                    required
                />
            </div>
            <div className="activity-detail-field">
                <h3 className="activity-detail-label">Phone Number:</h3>
                <input
                    type="text"
                    className="user-input"
                    name="phone"
                    value={booking.phone}
                    onChange={(event) => handleBookingChange(event,index)}
                    disabled={makeChange === index ? false : true}
                    required
                />
            </div>

            <div className="activity-detail-field" >
                <h3 className="activity-detail-label">Date:</h3>
                <p className="input-field" onClick={invalidUpdate}>
                    {booking.date.toString().slice(0, 10)}
                </p>
            </div>
            <div className="activity-detail-field">
                <h3 className="activity-detail-label">Start Time:</h3>
                <p className="input-field" onClick={invalidUpdate}>
                    {booking.startTime}
                </p>
            </div>
            <div className="activity-detail-field">
                <h3 className="activity-detail-label">End Time:</h3>
                <p className="input-field" onClick={invalidUpdate}>
                    {booking.endTime}
                </p>
            </div>
            <div className="activity-detail-field">
                <h3 className="activity-detail-label">
                    Number of Persons:
                </h3>
                <p className="input-field" onClick={invalidUpdate}>
                    {booking.person}
                </p>
            </div>
            <div className="activity-detail-field">
                <h3 className="activity-detail-label">
                    Seats Selected:
                </h3>
                <p className="input-field" onClick={invalidUpdate}>
                    {booking.seats}
                </p>
            </div>
            <div className="activity-detail-field">
                <h3 className="activity-detail-label">Message:</h3>
                <textarea
                    className="user-input textarea"
                    name="message"
                    onChange={(event) => handleBookingChange(event,index)}
                    required
                    value={booking.message}
                    disabled={makeChange === index ? false : true}
                ></textarea>
            </div>
        </form>
    )
}

export default BookingForm