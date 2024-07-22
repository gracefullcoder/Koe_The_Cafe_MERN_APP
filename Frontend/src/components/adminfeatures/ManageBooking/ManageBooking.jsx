import React, { useState, useEffect } from 'react';
import { deleteSectionData } from "../CustomizationAssets/CustomizationFunction.js";
import {Filter} from '../../Filter/Filter.jsx';

const ManageBooking = () => {
    const [todayBookings, setTodayBookings] = useState([]);
    const [aheadBookings, setAheadBookings] = useState([]);
    const [pastBookings, setPastBookings] = useState([]);

    const [filter, setFilter] = useState("Today Bookings");
    useEffect(() => {
        const getBookings = async () => {
            const url = `${import.meta.env.VITE_SERVER_ENDPOINT}/admin/bookings`;
            const fetchBookings = await fetch(url, {
                method: "GET",
                headers: { "content-Type": "application/json" },
                credentials: "include"
            });

            const bookingData = await fetchBookings.json();

            if (fetchBookings.ok) {
                setTodayBookings(bookingData.todayBookings);
                setAheadBookings(bookingData.aheadBookings);
                setPastBookings(bookingData.pastBookings);
            }
        }
        getBookings();
    }, [])

    const renderBookings = (bookings) => {
        return bookings.map((booking) => (
            <tr key={booking._id}>
                <th>{booking.date.toString().slice(0, 10)}</th>
                <td>{booking.time}</td>
                <td>
                    <ul>
                        {booking.seats.map((seat, index) => <li key={seat}>Seat{index + 1} {seat}</li>)}
                    </ul>
                </td>
                <td>{booking.name}</td>
                <td>{booking.phone}</td>
                <td>{booking.person}</td>
                <td>{booking.message}</td>
                <td>
                    <form className="signup-form" method="get" action={`/admin/bookings/edit/${booking._id}`}>
                        <button type="submit" className="btn btn-primary">
                            <span className="text text-1">Edit!</span>
                        </button>
                    </form>
                </td>
                <td>

                    <button type="submit" className="btn btn-primary" onClick={() => deleteBooking(booking._id)}>
                        <span className="text text-1">DELETE</span>
                    </button>

                </td>
            </tr>
        ));
    };

    const deleteBooking = async (bookingId) => {
        deleteSectionData(bookingId, "admin/bookings", setAheadBookings);
    }

    return (
        <section className="text-center" aria-label="countdown" id="workshop">
            <div className="title"><i className="uil uil-tachometer-fast-alt"></i><span className="text">Manage Booking</span></div>

            <div className="container">

                <Filter filter={{options:["All", "Today Bookings", "Ahead Bookings", "Past Bookings"],select:filter}} setState={setFilter} />


                <div className='table-container'>
                    {(filter == "All" || filter == "Today Bookings") &&
                        <>
                            <h2 className="headline-1 section-title">HAVE A LOOK ON Today Bookings</h2>
                            <table className="details-table">
                                <thead>
                                    <tr>
                                        <th scope="col">Date</th>
                                        <th scope="col">Time</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Phone No.</th>
                                        <th scope="col">No. of people</th>
                                        <th scope="col">Message</th>
                                        <th scope="col">Update</th>
                                        <th scope="col">Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {renderBookings(todayBookings)}
                                </tbody>
                            </table>
                            <hr style={{ marginBlock: '5rem 5rem' }} />
                        </>
                    }
                </div>

                <div className='table-container'>

                    {(filter == "All" || filter == "Ahead Bookings") &&

                        <>
                            <h2 className="headline-1 section-title">HAVE A LOOK ON Ahead Bookings</h2>
                            <table className="details-table">
                                <thead>
                                    <tr>
                                        <th scope="col">Date</th>
                                        <th scope="col">Time</th>
                                        <th>Seats</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Phone No.</th>
                                        <th scope="col">No. of people</th>
                                        <th scope="col">Message</th>
                                        <th scope="col">Update</th>
                                        <th scope="col">Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {renderBookings(aheadBookings)}
                                </tbody>
                            </table>
                            <hr style={{ marginBlock: '5rem 5rem' }} />
                        </>
                    }
                </div>

                <div className='table-container'>
                    {(filter == "All" || filter == "Past Bookings") &&

                        <>
                            <h2 className="headline-1 section-title">HAVE A LOOK ON Past Bookings</h2>
                            <table className="details-table">
                                <thead>
                                    <tr>
                                        <th scope="col">Date</th>
                                        <th scope="col">Time</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Phone No.</th>
                                        <th scope="col">No. of people</th>
                                        <th scope="col">Message</th>
                                        <th scope="col">Update</th>
                                        <th scope="col">Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {renderBookings(pastBookings)}
                                </tbody>
                            </table>
                        </>
                    }
                </div>


            </div>
        </section>

    );
};

export default ManageBooking;
