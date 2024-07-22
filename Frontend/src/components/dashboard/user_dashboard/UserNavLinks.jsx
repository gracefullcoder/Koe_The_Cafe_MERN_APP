import React, { useState } from 'react';
import { DashBoardNavLink, DashBoardSubNavLink } from '../DashBoardNavbar';

function UserNavLinks() {
  const [selectLink, setSelectLink] = useState(1);

  const handleSetSelect = (value) => {
    if (value != 0 && value != selectLink) {
      setSelectLink(value);
    }
  };

  return (
    <ul className="nav-links">
      <DashBoardNavLink
        id="dashboard"
        link="/dashboard"
        iconClass="uil uil-estate"
        linkName="Dashboard"
        end={true}
        setSelect={{ state: handleSetSelect, value: 1 }}
      />
      <li id="analytics">
        <DashBoardSubNavLink
          link="/dashboard/activity"
          iconClass="uil uil-chart"
          linkName="Activity"
          setSelect={{ state: handleSetSelect, value: 2 }}
        />
        <ul className={`sub-link ${selectLink === 2 ? 'active' : ''}`}>
          <DashBoardNavLink
            link="/dashboard/activity"
            iconClass="fa-solid fa-utensils"
            linkName="Bookings"
            end={true}
            setSelect={{ state: handleSetSelect, value: 0 }}
          />
          <DashBoardNavLink
            link="/dashboard/activity/workshop"
            iconClass="fa-solid fa-person-chalkboard"
            linkName="Workshops"
            end={true}
            setSelect={{ state: handleSetSelect, value: 0 }}
          />
          <DashBoardNavLink
            link="/dashboard/activity/testimonial"
            iconClass="fa-solid fa-comment"
            linkName="Testimonial"
            end={true}
            setSelect={{ state: handleSetSelect, value: 0 }}
          />
        </ul>
      </li>
      <DashBoardNavLink
        id="messagebroadcast"
        link="/dashboard/notifications"
        iconClass="fa-regular fa-message"
        linkName="Notifications"
        end={false}
        setSelect={{ state: handleSetSelect, value: 3 }}
      />
      <DashBoardNavLink
        id="order"
        link="/dashboard/order"
        iconClass="fa-solid fa-bowl-rice"
        linkName="Orders"
        end={false}
        setSelect={{ state: handleSetSelect, value: 4 }}
      />
    </ul>
  );
}

export default UserNavLinks;
