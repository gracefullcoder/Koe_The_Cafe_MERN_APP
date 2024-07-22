import koeLogo from "../../assets/images/koe-logo.png";
// import "../../sass/components/_footer.scss";
import { Link } from "react-router-dom";
import { actionPerformed, linkVisited, pageVisited } from "../../helperfunction";
import Map from "../Map/Map";


export default function Footer() {

  return (
    <footer className="footer section has-bg-image text-center">
      <div className="container">
        <div className="footer-top grid-list">
          <div className="footer-brand has-before has-after">
            <Link to="/" className="logo">
              <img
                src={koeLogo}
                width="160"
                height="50"
                loading="lazy"
                alt="Koe logoapp"
                style={{ borderRadius: "1rem" }}
              />
            </Link>

            <a href="#map" className="body-4 contact-link" onClick={(event) => {linkVisited(event,"Google Map")}}>
              <address>
                205, International Finance Centre,
                <br /> VIP Road, opp. Fire Station,
                <br /> Vesu, Surat, <br />
                Gujarat - 395007
              </address>
            </a>

            <a
              href="mailto:koethekafe@gmail.com"
              className="body-4 contact-link"
              onClick={(event) => linkVisited(event, "Mail")}
            >
              koethekafe@gmail.com
            </a>

            <a href="tel:+91-96246 96846" className="body-4 contact-link" onClick={(event) => linkVisited(event, "Contact")}>
              Booking Request : +91 96246 96846
            </a>

            <p className="body-4">Open : 12:00 pm - 12:30 am</p>

            <div className="seprator-wrapper">
              <div className="separator"></div>
              <div className="separator"></div>
              <div className="separator"></div>
            </div>
          </div>

          <ul className="footer-list">
            <li>
              <Link to="/" className="label-2 footer-link hover-underline">
                Home
              </Link>
            </li>

            <li>
              <a
                href="#menu-section"
                // target="_blank"
                className="label-2 footer-link hover-underline"
                onClick={() => actionPerformed("sectionVisited", "Menu")}
              >
                Menus
              </a>
            </li>

            <li>
              <a href="#workshop" className="label-2 footer-link hover-underline" onClick={() => actionPerformed("sectionVisited", "Workshop")}>
                Workshop
              </a>
            </li>

            <li>
              <a href="#about" className="label-2 footer-link hover-underline" onClick={() => actionPerformed("sectionVisited", "about")}>
                About Us
              </a>
            </li>

            <li>
              <a href="#reservation" className="label-2 footer-link hover-underline" onClick={() => actionPerformed("sectionVisited", "Reservation")}>
                Book Table!
              </a>
            </li>

            <li>
              <a
                href="tel:+91-96246 96846"
                className="body-4 contact-link label-2 footer-link hover-underline"
                onClick={linkVisited}
              >
                Contact
              </a>
            </li>
          </ul>

          <ul className="footer-list">
            <li>
              <a href="#footer" className="label-2 footer-link hover-underline"
                onClick={linkVisited}
              >
                Facebook
              </a>
            </li>

            <li>
              <a
                href="https://www.instagram.com/koethekafe/"
                className="label-2 footer-link hover-underline"
                onClick={linkVisited}
                target="_blank"
              >
                Instagram
              </a>
            </li>

            <li>
              <a href="#footer" className="label-2 footer-link hover-underline" onClick={linkVisited}>
                Twitter
              </a>
            </li>

            <li>
              <a href="#footer" className="label-2 footer-link hover-underline" onClick={linkVisited}>
                Youtube
              </a>
            </li>

            <li>
              <a
                href="#map"
                className="label-2 footer-link hover-underline"
                onClick={linkVisited}
              >
                Google Map
              </a>
            </li>
          </ul>
        </div>
      </div>
      <Map />
    </footer>
  );
}
