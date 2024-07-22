import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toastMessage } from "../../../helperfunction.js";
import BookingForm from "./BookingForm.jsx";
import { Filter } from "../../Filter/Filter.jsx";


function UserBooking() {
  const { bookings } = useOutletContext();
  console.log(bookings);
  let { userBookings, pastBookings, setUserBookings } = bookings;
  const [makeChange, setMakeChange] = useState("");
  let [bookingFilter, setBookingFilter] = useState("Current Bookings");


  function toggleUpdation(event, index) {
    setMakeChange(index);
  }

  async function handleUpdation(event, index, bookingId) {
    event.preventDefault();
    let updationUrl = `${import.meta.env.VITE_SERVER_ENDPOINT}/dashboard/booking/${bookingId}`;
    let { name, phone, message } = userBookings.currBookings[index];
    let fetchBooking = await fetch(updationUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ name, phone, message })
    })
    if (fetchBooking.ok) setMakeChange("");
    const bookingData = await fetchBooking.json();
    toastMessage(bookingData);
  }

  async function handleDeletion(event, index, bookingId) {
    event.preventDefault();
    let deletionUrl = `${import.meta.env.VITE_SERVER_ENDPOINT}/dashboard/booking/${bookingId}`;
    console.log(deletionUrl);
    let fetchBooking = await fetch(deletionUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    })

    if (fetchBooking.ok) {
      setUserBookings((bookings) => {
        let newBookings = bookings.currBookings;
        newBookings.splice(index, 1);
        console.log(newBookings)
        return { currBookings: newBookings };
      });
      console.log(userBookings);
      setMakeChange("");
    }

    const bookingData = await fetchBooking.json();
    toastMessage(bookingData);
  }

  return (
    <>
      <h1 className="activity-heading">My Bookings </h1>
      <Filter filter={{ select: bookingFilter, options: ['Current Bookings', 'Past Bookings', "All Bookings"] }} setState={setBookingFilter} />

      {
        (bookingFilter == "Current Bookings" || bookingFilter == "All Bookings") && (
          <div className="current-workshops">
            <h2
              className="activity-detail-label activity-sub-heading"
            >
              Current Bookings
            </h2>
            <div className="user-activity">
              {userBookings.currBookings.length == 0 ? (
                <div className="no-activity">
                  <p className=" no-data">No Bookings Done!</p>
                  <a href="/#reservation" className="text-center">Book a table Now!</a>
                </div>
              ) : (
                <>
                  {userBookings.currBookings.map((booking, index) => (
                    <div className="activity-box booking-box" key={booking._id}>
                      <BookingForm booking={booking} index={index} makeChange={makeChange} setUserBookings={setUserBookings} />
                      {makeChange === index ? (
                        <div className="update-button">
                          <button
                            className="buttonuser btn btn-secondary"
                            role="button"
                            onClick={(event) => handleUpdation(event, index, booking._id)}
                          >
                            <span className="text text-1">Update</span>
                            <span className="text text-2">Update</span>
                          </button>
                          <button
                            className="buttonuser btn btn-secondary"
                            role="button"
                            onClick={(event) => (handleDeletion(event, index, booking._id))}
                          >
                            <span className="text text-1">Delete</span>
                            <span className="text text-2">Delete</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          className="buttonuser btn btn-secondary"
                          role="button"
                          onClick={(event) => toggleUpdation(event, index)}
                        >
                          <span className="text text-1">Make Changes!</span>
                          <span className="text text-2">Make Changes!</span>
                        </button>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>

          </div>
        )
      }

      {(bookingFilter == "Past Bookings" || bookingFilter == "All Bookings") && (
        <div className="past-bookings">
          <h2
            className="activity-detail-label activity-sub-heading"
          >
            Past Bookings
          </h2>
          <div className="user-activity">

            {pastBookings.length == 0 ? (
              <div className="no-activity">
                <p className=" no-data">No Bookings Done in Past!</p>
                <a href="/#reservation" className="text-center">Book a table Now!</a>
              </div>
            ) : (
              <>
                {pastBookings.map((booking, index) => (
                  <div className="activity-box booking-box" key={booking._id}>
                    <BookingForm index={""} makeChange={makeChange} setUserBookings={setUserBookings} booking={booking} />
                    <button
                      className="buttonuser btn btn-secondary"
                      role="button"
                    >
                      <span className="text text-1">Give Feedback!</span>
                      <span className="text text-2">Experience  !</span>
                    </button>

                  </div>
                ))}
              </>

            )}
          </div>
        </div>)}
    </>
  );
}

export default UserBooking;
