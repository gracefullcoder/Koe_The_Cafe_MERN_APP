import React from "react";
import { Link, NavLink } from "react-router-dom";
import koeLogo from "../../assets/images/koe-logo.png";

export function DashBoardNavbar({ toggleClose, close, navLinksList, navTitle }) {
  return (
    <nav className={`dashboard-nav ${close}`}>
      <div className="nav-intro">
        <div className="logo-image">
          <Link to="/">
            <img src={koeLogo} className="koe-logo" alt="Logo" />
          </Link>
        </div>
        <Link to="/">
          <span className="nav-title">{navTitle}</span>
        </Link>
        <i className="uil uil-times close-btn" onClick={toggleClose}></i>
      </div>
      <div className="nav-options">
        {navLinksList}
        <ul className="logout-mode">
          <li>
            <Link to="/auth/logout">
              <i className="uil uil-signout"></i>
              <span className="link-name">Logout</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export function DashBoardNavLink({ id, link, iconClass, linkName, end, setSelect }) {
  return (
    <li id={id}>
      <NavLink to={link} end={end} onClick={() => setSelect.state(setSelect.value)}>
        <i className={iconClass}></i>
        <span className="link-name">{linkName}</span>
      </NavLink>
    </li>
  );
}

export function DashBoardSubNavLink({ id, link, iconClass, linkName, end, setSelect }) {
  return (
    <div id={id}>
      <NavLink to={link} end={end} onClick={() => setSelect.state(setSelect.value)} style={{justifyContent:'space-between'}}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <i className={iconClass}></i>
          <span className="link-name">{linkName}</span>
        </div>
        <i className="uil uil-angle-down"></i>
      </NavLink>
    </div>
  );
}
