import React, { useEffect, useState, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContext";
import { toast } from "react-toastify";

function Activity() {
  let { user } = useAuthContext();
  let [userBookings, setUserBookings] = useState();
  let [userWorkshops, setUserWorkshops] = useState();
  let [userTestimonial, setUserTestimonial] = useState();
  let [userActivity, setUserActivity] = useState(false);
  const navigate = useNavigate();
  const pastBookingsRef = useRef([]);
  const pastWorkshopsRef = useRef([]);

  useEffect(() => {
    async function renderDashboard() {
      if (!user) {
        toast.error("Signup First To access your Dashboard", {
          autoClose: 5000,
          position: "top-center",
        });
        navigate("/auth/signup");
        return;
      }

      const dashboardUrl = `${import.meta.env.VITE_SERVER_ENDPOINT}/dashboard`;
      const fetchActivity = await fetch(dashboardUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (fetchActivity.ok) {
        const activityData = await fetchActivity.json();
        console.log(activityData);
        setUserBookings({ currBookings: activityData.currBookings });
        setUserWorkshops({ currWorkshops: activityData.currWorkshops });
        setUserTestimonial(activityData.testimonial);
        pastBookingsRef.current = activityData.pastBookings;
        pastWorkshopsRef.current = activityData.pastWorkshops;
        setUserActivity(true);
      }
      console.log("Activity data fetched");
    }

    renderDashboard();
  }, [user, navigate]);

  return (
    <div className="activity" id="activity">
      <div className="title">
        <i className="uil uil-clock-three"></i>
        <span className="text">User Activity</span>
      </div>
      <div className="activity-data">
        {userActivity ? (
          <Outlet
            context={{
              bookings: { userBookings, setUserBookings, pastBookings: pastBookingsRef.current },
              workshops: { userWorkshops, setUserWorkshops, pastWorkshops: pastWorkshopsRef.current },
              testimonial: { userTestimonial, setUserTestimonial },
            }}
          />
        ) : (
          <h1>Loading</h1>
        )}
      </div>
    </div>
  );
}

export default Activity;
