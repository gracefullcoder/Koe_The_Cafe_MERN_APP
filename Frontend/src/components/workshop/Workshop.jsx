import React, { memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import updateCountdown from "./counter.js";
import { toast } from "react-toastify";
import { actionPerformed, monitorActivity } from "../../helperfunction.js";

const Workshop = ({ workshop, isWorkshop, isUser }) => {
  // console.log("workshop is called");

  let [workshopRegistration, setWorkshopRegistartion] = useState({
    userPhone: "",
    userMessage: ""
  });

  useEffect(() => {
    if (isWorkshop) {
      const startCountDown = setInterval(() => { updateCountdown(workshop.time) }, 1000);
      return (() => {
        clearInterval(startCountDown)
      })
    } else {
      updateCountdown(workshop.time)
    }
  }, [workshop.time]);

  function handleInputChange(event) {
    setWorkshopRegistartion((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleRegistartion(event) {
    event.preventDefault();

    if (isUser && isWorkshop) {
      if (
        workshopRegistration.userPhone.length == 10 &&
        parseInt(workshopRegistration.userPhone).toString().length == 10
      ) {
        const registrationURL = `${import.meta.env.VITE_SERVER_ENDPOINT}/register/${workshop._id}`;
        const registerUser = await fetch(registrationURL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(workshopRegistration)
        });

        if (registerUser.ok) {
          let requestMessage = await registerUser.json();
          toast.success(requestMessage.message, {
            position: "top-center",
            autoClose: 2000,
          });
          setWorkshopRegistartion({ userPhone: "", userMessage: "" });
        }
      } else {
        toast.error("Please Enter a Valid Phone Number", {
          position: "top-center",
          autoClose: 2000
        });
      }
    } else {
      toast.error("Signup to Register For Workshop!", {
        position: "top-center",
        autoClose: 2000
      });
    }
  }

  return (
    <section
      className="section workshop bg-black-10 text-center"
      aria-label="Workshop Section"
      id="workshop"
    >
      <div className="container">
        
        <p className="section-subtitle label-2">{workshop.label}</p>

        <h2 className="headline-1 section-title" id="countdown-title">
          {workshop.title}
        </h2>

        <div id="countdown" className="countdown-container">
          <div className="countdown-item">
            <span className="countdown-number"></span>
            <span className="countdown-label">Days</span>
          </div>
          <div className="countdown-item">
            <span className="countdown-number"></span>
            <span className="countdown-label">Hours</span>
          </div>
          <div className="countdown-item">
            <span className="countdown-number"></span>
            <span className="countdown-label">Minutes</span>
          </div>
          <div className="countdown-item">
            <span className="countdown-number"></span>
            <span className="countdown-label">Seconds</span>
          </div>
        </div>

        <p className="section-text">{workshop.text}</p>

        <form
          key={workshop._id}
          onSubmit={handleRegistartion}
        >
          <label htmlFor="phonenumber">Phone Number:</label>
          <input
            type="number"
            id="phonenumber"
            className="input-field"
            name="userPhone"
            onChange={handleInputChange}
            value={workshopRegistration.userPhone}
            required
          />

          <label htmlFor="message">Message:</label>
          <input
            type="text"
            id="message"
            className="input-field"
            name="userMessage"
            onChange={handleInputChange}
            value={workshopRegistration.userMessage}
            required
          />

          {isWorkshop ? (
            <>
              {isUser ? (
                <button type="submit" className="btn btn-primary" onClick={() => actionPerformed("workshop", 'Registration trial!')}>
                  <span className="text text-1">Register!</span>
                  <span className="text text-2" aria-hidden="true">
                    Register!
                  </span>
                </button>
              ) : (
                <Link to="/auth/login" className="btn btn-primary">
                  <span className="text text-1">Sign in to Register!</span>
                  <span className="text text-2" aria-hidden="true">
                    Sign in to Register!
                  </span>
                </Link>
              )}
            </>
          ) : (
            <p className="btn btn-primary" onClick={() => actionPerformed("workshop", 'Registration trial but over!')}>
              <span className="text text-1">Registrations are Over!</span>
              <span className="text text-2" aria-hidden="true">
                Starts Soon!
              </span>
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

export default Workshop;
