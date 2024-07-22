import React, { useState } from "react";
import formBackground from "../../assets/images/form-pattern.png";
import SeatStructure from "./SeatStructure";
import { actionPerformed, linkVisited, toastMessage, validatePhoneNumber } from "../../helperfunction";
import { toast } from "react-toastify";


function validateBookingData(data) {

  if (data.name.length <= 3) {
    return 'Name should be longer than 3 characters';
  }

  const validatePhoneNumber = (phone) => {
    const phonePattern = /^\d{10}$/;
    return phonePattern.test(phone);
  };

  if (!validatePhoneNumber(data.phone)) {
    return 'Please enter a valid phone number';
  }

  const isValidDate = (date) => {
    return !isNaN(Date.parse(date));
  };

  if (!isValidDate(data.date)) {
    return 'Please input valid Booking Date';
  }

  if (!(data.startTime && data.endTime)) {
    return 'Please input valid start time and end time';
  }

  let startTime = new Date(`${data.date}T${data.startTime}`);
  const currentDate = new Date();

  if (currentDate > startTime) {
    return "Can't book a seat in the past. Please contact Poonam Pandey!";
  }

  let endTime = new Date(`${data.date}T${data.endTime}`);
  if (data.endTime == '00:00') {
    endTime.setDate(endTime.getDate() + 1);
  }
  const storeOpenTime = new Date(`${data.date}T12:00:00`);
  const storeCloseTime = new Date(`${data.date}T00:00:00`);

  storeCloseTime.setDate(storeCloseTime.getDate() + 1);

  if (startTime > endTime) {
    return 'NOTE: Store Closes at 12:00 AM , Start time should be before end time';
  }


  if (startTime < storeOpenTime) {
    return 'Store starts at 12:00 PM';
  } else if (endTime > storeCloseTime) {
    return 'Store closes at 12:00 AM';
  }

  return false;
}


function Reservation({ isUser, userId }) {
  console.log("reservation is called");
  let [reservationData, setReservationData] = useState({
    name: "",
    phone: "",
    startTime: "",
    endTime: "",
    date: "",
    message: ""
  });

  const [selectedSeats, setSelectedSeats] = useState([]);

  let [loadSeats, setLoadSeats] = useState(false);

  function handleReservationData(event) {
    setReservationData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  }


  function loadSeatsMatrix(event) {
    event.preventDefault();
    const message = validateBookingData(reservationData);
    if (!message) {
      setLoadSeats(true);
      let formdiv = document.querySelector(".reservation-form");
      formdiv.classList.add("selection");
    }
    else {
      toast.info(message);
    }
  }



  return (
    <section className="section reservation" id='reservation'>
      <div className="container">
        <div className="form reservation-form bg-black-10">
          <form className="form-left" onSubmit={loadSeatsMatrix}>
            <h2 className="headline-1 text-center">Online Reservation</h2>

            <p className="form-text text-center">
              Booking request <br />
              <a href="tel:+919624696846" className="link" onClick={(event) => linkVisited(event, "Contact")}>
                CONTACT: +91 9624696846
              </a>
              &nbsp; or fill out the order form
            </p>

            <div className="input-wrapper">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                autoComplete="off"
                className="input-field"
                value={reservationData.name}
                onChange={handleReservationData}
                required
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                autoComplete="off"
                className="input-field"
                id="booking-phonenumber"
                value={reservationData.phone}
                onChange={handleReservationData}
              />
            </div>

            <div className="input-wrapper">
              <div>
                <p className="text-center">Reservation Date</p>
                <div className="icon-wrapper">
                  <ion-icon
                    name="calendar-clear-outline"
                    aria-hidden="true"
                  ></ion-icon>

                  <input
                    type="date"
                    name="date"
                    className="input-field"
                    value={reservationData.date}
                    onChange={handleReservationData}
                  />

                  <ion-icon name="chevron-down" aria-hidden="true"></ion-icon>
                </div>
              </div>

              <div>
                <p className="text-center">Start Time</p>
                <div className="icon-wrapper">

                  <label htmlFor="timeInput" className="input-label">
                    <ion-icon name="timer-outline"></ion-icon>
                    <input
                      id="timeInput"
                      name="startTime"
                      className="input-field"
                      type="time"
                      value={reservationData.startTime}
                      onChange={handleReservationData}
                      required
                    />
                    <ion-icon name="chevron-down" aria-hidden="true"></ion-icon>
                  </label>
                </div>
              </div>

              <div>
                <p className="text-center">End Time</p>
                <div className="icon-wrapper">
                  <label htmlFor="timeInput" className="input-label">
                    <ion-icon name="timer-outline"></ion-icon>
                    <input
                      id="timeInput"
                      name="endTime"
                      className="input-field"
                      type="time"
                      value={reservationData.endTime}
                      onChange={handleReservationData}
                      required
                    />
                    <ion-icon name="chevron-down" aria-hidden="true"></ion-icon>
                  </label>
                </div>
              </div>

              {selectedSeats.length != 0 && <div className="icon-wrapper">
                <input
                  type="text"
                  name="seats"
                  placeholder="Your Selected Seats"
                  autoComplete="off"
                  className="input-field"
                  value={selectedSeats}
                  disabled
                  required
                />
              </div>}

            </div>



            <textarea
              name="message"
              placeholder="Message"
              autoComplete="off"
              className="input-field"
              value={reservationData.message}
              onChange={handleReservationData}
            ></textarea>

            {isUser ? (
              <div className="icon-wrapper" onClick={() => actionPerformed('booking', "Tried to load seat matrix")}>
                <button className="btn btn-primary" onClick={loadSeatsMatrix}>
                  <span className="text text-1">Select Seats And Book The Table!</span>
                  <span className="text text-2">Let's Go</span>
                </button>
              </div>
            ) : (
              <a href="/auth/signup" className="btn btn-secondary" onClick={() => actionPerformed('booking', "Not signed up")}>
                <span className="text text-1">Sign Up First!</span>

                <span className="text text-2" aria-hidden="true">
                  Sign Up to Book a Table!
                </span>
              </a>
            )}
          </form>

          <div
            className="form-right text-center"
            style={{
              backgroundImage: `url(${formBackground})`,
            }}
          >
            <h2 className="headline-1 text-center">Contact Us</h2>

            <p className="contact-label">Booking Request</p>

            <a
              href="tel:+9196246 96846"
              className="body-1 contact-number hover-underline"
              onClick={(event) => linkVisited(event, "Contact")}
            >
              +91 96246 96846
            </a>

            <div className="separator"></div>

            <p className="contact-label">Location</p>

            <a href="#map" onClick={(event) => { linkVisited(event, "Google Map") }}>
              <address className="body-4">
                205, International Finance Centre,
                <br /> VIP Road, opp. Fire Station,
                <br /> Vesu, Surat, <br />
                Gujarat - 395007
              </address>
            </a>

            <p className="contact-label">Hours</p>

            <p className="body-4">
              Monday to Sunday <br />
              12.00 pm - 12.00am
            </p>
          </div>
        </div>
        {loadSeats && <SeatStructure selectedSeats={selectedSeats} setSelectedSeats={setSelectedSeats} setLoadSeats={setLoadSeats} userId={userId} reservationData={reservationData} setReservationData={setReservationData} />}
      </div>
    </section>
  );
}

export default Reservation;
