import React, { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { toastMessage, getTime } from "../../../helperfunction";
import { toast } from "react-toastify";
import { Filter } from "../../Filter/Filter";

function WorkshopRegistered() {
  const { workshops } = useOutletContext();
  const { userWorkshops, setUserWorkshops, pastWorkshops } = workshops;
  const [makeChange, setMakeChange] = useState(null);
  let [WorkshopFilter, setWorkshopFilter] = useState("Current Workshops");

  function toggleUpdation(event, index) {
    setMakeChange(index);
  }

  function handleDetailsUpdation(event, index) {
    setUserWorkshops((workshops) => {
      let newData = workshops.currWorkshops.map((workshop, idx) => {
        if (index == idx) {
          return { ...workshop, [event.target.name]: event.target.value }
        }
        return workshop;
      })
      return { currWorkshops: newData };
    })
  }

  async function handleUpdation(event, index, registrationId) {
    event.preventDefault();
    console.log("in");
    try {
      let msgData = { userPhone: userWorkshops.currWorkshops[index].phoneNumber.toString(), userMessage: userWorkshops.currWorkshops[index].message };
      const registrationUrl = `${import.meta.env.VITE_SERVER_ENDPOINT}/dashboard/registration/${registrationId}`;
      console.log(registrationUrl, "{{{{}}}}}}}}", msgData);
      const fetchRegistration = await fetch(registrationUrl, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(msgData)
      })

      if (fetchRegistration.ok) setMakeChange(null);
      let registrationData = await fetchRegistration.json();
      toastMessage(registrationData);
    }
    catch (error) {
      console.log(error);
      toast.error(error);
    }
  }

  async function handleDeletion(event, index, registrationId) {
    event.preventDefault();
    try {
      let msgData = { userPhone: userWorkshops.currWorkshops[index].phoneNumber.toString(), userMessage: userWorkshops.currWorkshops[index].message };
      const registrationUrl = `${import.meta.env.VITE_SERVER_ENDPOINT}/dashboard/registration/${registrationId}`;
      const fetchRegistration = await fetch(registrationUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include"
      })

      if (fetchRegistration.ok) {
        setMakeChange(null);
        setUserWorkshops((prevData) => {
          let newData = prevData.currWorkshops;
          newData.splice(index, 1);
          return { currWorkshops: newData };
        })
      }

      let registrationData = await fetchRegistration.json();
      toastMessage(registrationData);
    }
    catch (error) {
      console.log(error);
      toast.error(error);
    }
  }

  return (
    <>
      <h1 className="activity-heading">Workshop Registrations</h1>
      <Filter filter={{ select: WorkshopFilter, options: ['Current Workshops', 'Past Workshops', "All Workshops"] }} setState={setWorkshopFilter} />

      {
        (WorkshopFilter === "Current Workshops" || WorkshopFilter === "All Workshops") &&
        <div className="current-workshops">
          <h2
            className="activity-detail-label activity-sub-heading"
            style={{ marginLeft: "1rem" }}
          >
            Current Workshops Registerd
          </h2>
          <div className="user-activity">
            {userWorkshops.currWorkshops.length == 0 ?
              (<div className="no-activity">
                <p className="no-data">Register For Next Workshop!</p>
                <Link to="/">Register Now!</Link>
              </div>) :
              (
                userWorkshops.currWorkshops.map((registration, index) => (
                  <div className="activity-box workshop-box" key={registration.workshop._id}>
                    <div className="workshop-post">
                      <h2 className="activity-number">Booking {index + 1}</h2>
                      <div className="activity-detail-field">
                        <h3 className="activity-detail-label">Title:</h3>
                        <p className="workshop-detail">{registration.workshop.title}</p>
                      </div>
                      <div className="activity-detail-field">
                        <h3 className="activity-detail-label">Workshop Description:</h3>
                        <p className="workshop-detail">{registration.workshop.text}</p>
                      </div>
                      <div className="activity-detail-field">
                        <h3 className="activity-detail-label">Date:</h3>
                        <p className="workshop-detail">
                          {registration.workshop.time.toString().slice(0, 10)}
                        </p>
                      </div>
                      <div className="activity-detail-field">
                        <h3 className="activity-detail-label">Time:</h3>
                        <p className="workshop-detail">
                          {getTime(registration.workshop.time)}
                        </p>
                      </div>
                    </div>
                    <div className="user-details-workshop">
                      <form>
                        <h2 className="workshop-detail-heading">Your Response</h2>
                        <div className="activity-detail-field">
                          <h3 className="activity-detail-label">PhoneNumber:</h3>
                          <input
                            type="text"
                            className="user-input"
                            name="phoneNumber"
                            value={registration.phoneNumber}
                            disabled={makeChange == index ? false : true}
                            onChange={(event) => (handleDetailsUpdation(event, index))}
                            required
                          />
                        </div>
                        <div className="activity-detail-field">
                          <h3 className="activity-detail-label">Message:</h3>
                          <textarea className="user-input textarea"
                            name="message" value={registration.message}
                            disabled={makeChange == index ? false : true}
                            onChange={(event) => (handleDetailsUpdation(event, index))}>
                          </textarea>
                        </div>
                        {makeChange == index && (
                          <div className="update-button">
                            <button
                              className="buttonuser btn btn-secondary"
                              role="button"
                              onClick={(event) => handleUpdation(event, index, registration.workshop._id)}
                            >
                              <span className="text text-1">Update</span>
                              <span className="text text-2">Update</span>
                            </button>
                            <button
                              className="buttonuser btn btn-secondary"
                              role="button"
                              onClick={(event) => handleDeletion(event, index, registration._id)}
                            >
                              <span className="text text-1">Delete</span>
                              <span className="text text-2">Delete</span>
                            </button>
                          </div>
                        )}
                      </form>
                      {makeChange != index && (
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
                  </div>
                ))
              )}

          </div>
        </div>
      }

      {
        (WorkshopFilter === "Past Workshops" || WorkshopFilter === "All Workshops") &&
        <div className="past-workshops">
          <h2 className="activity-detail-label activity-sub-heading" style={{ marginLeft: "1rem" }}>
            Past Workshops Registerd
          </h2>
          <div className="user-activity">
            {pastWorkshops.length == 0 ?
              (<div className="no-activity">
                <p className="no-data">Till yet not registerd in any Workshop in past !</p>
                <Link to="/#workshop">Register Now!</Link>
              </div>) :
              (
                pastWorkshops.map((registration, index) => (
                  <div className="activity-box workshop-box" key={registration._id}>
                    <div className="workshop-post">
                      <h2 className="activity-number">Booking {index + 1}</h2>
                      <div className="activity-detail-field">
                        <h3 className="activity-detail-label">Title:</h3>
                        <p className="workshop-detail">{registration.workshop.title}</p>
                      </div>
                      <div className="activity-detail-field">
                        <h3 className="activity-detail-label">Workshop Description:</h3>
                        <p className="workshop-detail">{registration.workshop.text}</p>
                      </div>
                      <div className="activity-detail-field">
                        <h3 className="activity-detail-label">Date:</h3>
                        <p className="workshop-detail">
                          {registration.workshop.time.toString().slice(0, 10)}
                        </p>
                      </div>
                      <div className="activity-detail-field">
                        <h3 className="activity-detail-label">Time:</h3>
                        <p className="workshop-detail">
                          {getTime(registration.workshop.time)}
                        </p>
                      </div>
                    </div>
                    <div className="user-details-workshop">
                      <h2 className="workshop-detail-heading">Your Response</h2>
                      <div className="activity-detail-field">
                        <h3 className="activity-detail-label">PhoneNumber:</h3>
                        <input
                          type="text"
                          className="user-input"
                          name="userPhone"
                          value={registration.phoneNumber}
                          disabled="disabled"
                        />
                      </div>
                      <div className="activity-detail-field">
                        <h3 className="activity-detail-label">Message:</h3>
                        <textarea
                          className="user-input textarea"
                          name="message"
                          value={registration.message}
                          disabled="disabled"
                        >
                          registration.message
                        </textarea>
                      </div>
                    </div>
                  </div>
                ))
              )}
          </div>
        </div>
      }
    </>
  );
}

export default WorkshopRegistered;
