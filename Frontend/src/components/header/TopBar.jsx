import react, { memo, useContext } from "react";
import { actionPerformed, linkVisited } from "../../helperfunction";
// import AuthContext from "../../context/AuthContext";


const TopBar = memo(() => {
  // console.log("TopBar is called");
  return (
    <div className="topbar">
      <div className="container">
        <address className="topbar-item">
          <div className="icon">
            <ion-icon name="location-outline" aria-hidden="true"></ion-icon>
          </div>

          <span className="span">
            <a href="#map" onClick={(event) => linkVisited(event,"Google Map")}>
              205, International Finance Centre, VIP Road, Surat
            </a>
          </span>
        </address>

        <div className="separator"></div>

        <div className="topbar-item item-2">
          <div className="icon">
            <ion-icon name="time-outline" aria-hidden="true"></ion-icon>
          </div>

          <span className="span">Daily : 12.00 pm to 12.30 am</span>
        </div>

        <a href="tel:To add" className="topbar-item link" onClick={(event) => linkVisited(event,"Contact")} >
          <div className="icon">
            <ion-icon name="call-outline" aria-hidden="true"></ion-icon>
          </div>

          <span className="span">+91 96246 96846</span>
        </a>

        <div className="separator"></div>

        <a href="mailto:koethekafe@gmail.com" className="topbar-item link" onClick={(event) => linkVisited(event,"Mail")}>
          <div className="icon">
            <ion-icon name="mail-outline" aria-hidden="true"></ion-icon>
          </div>

          <span className="span">koethekafe@gmail.com</span>
        </a>
      </div>
    </div>
  );
})

const HeaderLink = memo(({ sectionLink, name }) => {
  // console.log("headerLink is called");
  return (
    <li className="navbar-item">
      <a href={sectionLink}
        className={`navbar-link hover-underline ${name === "Home" ? "active" : ""}`}
        onClick={() => actionPerformed("sectionLookup",name)}
      >
        <div className="separator"></div>
        <span>{name}</span>
      </a>
    </li>
  );
})

export { TopBar, HeaderLink }
