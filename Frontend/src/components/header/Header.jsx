import React, { memo, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import koeLogo from "../../assets/images/koe-logo.png";
import { HeaderLink, TopBar } from "./TopBar.jsx";
import { Link } from "react-router-dom";
import { CartIcon } from "../cart/Cart.jsx";
import { linkVisited } from "../../helperfunction.js";

export default memo(function Header({ user, onLogout }) {
  // console.log("header is called");
  let [lastScroll, setLastScroll] = useState(0);
  let [headerState, setHeaderState] = useState("header");
  let [account, setAccount] = useState(false);

  useEffect(() => {
    function hideHeader() {
      if (lastScroll < window.scrollY) {
        setHeaderState("header active hide");
      } else {
        setHeaderState("header active");
      }
      setLastScroll(window.scrollY);
    }

    let handleScroll = () => {
      if (window.scrollY > 50) {
        hideHeader();
      } else {
        setHeaderState("header");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  let [navToggler, setNavToggler] = useState("");

  const toggleNavBar = useCallback(() => {
    setNavToggler((prev) => (prev === "active" ? "" : "active"));
  }, [])

  const toggleAccount = useCallback(() => {
    setAccount((prev) => !prev);
  }, [])

  const logoutUser = useCallback(async () => {
    try {
      const logoutUrl = `${import.meta.env.VITE_SERVER_ENDPOINT}/auth/logout`;
      const logoutRequest = await fetch(logoutUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (logoutRequest.ok) {
        toast.success("Logout Successfull!", {
          position: "top-center",
          autoClose: 2000,
        });
        onLogout();
        // const jsonData = await logoutRequest.json();
        // console.log(jsonData);
      }
    } catch (error) {
      console.log(error, "Failed to logout!");
      toast.error("Logout unsuccessfull!", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  }, [])

  return (
    <>
      <TopBar />
      <header className={headerState} data-header>
        <div className="container">
          <Link to="#top" className="logo">
            <img src={koeLogo} alt="Koe logo" className="logo-img" />
          </Link>

          <nav className={`navbar ${navToggler}`} data-navbar>
            <button
              className="close-btn"
              aria-label="close menu"
              data-nav-toggler
              onClick={toggleNavBar}
            >
              <ion-icon name="close-outline" aria-hidden="true"></ion-icon>
            </button>

            <Link to="#top" className="logo">
              <img src={koeLogo} width="160" height="50" alt="Koe logo" />
            </Link>

            <ul className="navbar-list">
              <HeaderLink sectionLink="#top" name="Home" />
              <HeaderLink sectionLink='#menu-section' name="Menus" />
              <HeaderLink sectionLink="#workshop" name="Workshop" />
              <HeaderLink sectionLink="#about" name="About Us" />
              <HeaderLink sectionLink="#specialities" name="Specialities" />
              <HeaderLink sectionLink="#events" name="Events" />
              <HeaderLink sectionLink="#testimonials" name="Testimonials" />
            </ul>

            <div className="text-center">
              <p className="headline-1 navbar-title">Visit Us</p>

              <address className="body-4" onClick={(event) => linkVisited(event,"Google Map")}>
                205, International Finance Centre, VIP Road, opp. Fire Station,
                Vesu, <br />
                Surat, Gujarat 395007
              </address>

              <p className="body-4 navbar-text">Open: 12.00 pm to 12.30 am</p>

              <Link
                to="mailto:koethecafe@gmail.com"
                className="body-4 sidebar-link laila"
                onClick={(event) => linkVisited(event,"Mail")}
              >
                koethecafe@gmail.com
              </Link>

              <div className="separator"></div>

              <p className="contact-label">Booking Request</p>

              <Link
                to="tel:+919624696846"
                className="body-1 contact-number hover-underline"
                onClick={(event) => linkVisited(event,"Contact")}
              >
                +91 96246 96846
              </Link>
            </div>
          </nav>

          <div className="account-hamburger-wrapper">
            {user ? (
              <>
                <CartIcon />

                <div className="notification-badge-div" onClick={toggleAccount}>
                  {user.notification.notificationsRemaining > 0 && (
                    <div className="notification-badge"></div>
                  )}

                  <img
                    id="profilepicture"
                    src={user.profilepicture.imagelink}
                    alt="DP"
                  />
                </div>

                {account && (
                  <>
                    <div id="account-options" className="account-options">
                      <div className="account-field-name">
                        Hi {user.fullname}!
                      </div>
                      <div className="account-field">
                        <Link
                          to="/dashboard"
                          className="account-field-link"
                        // state={{ user }}
                        >
                          <div className="separator"></div>
                          <span className="span">Account Details</span>
                        </Link>
                      </div>
                      <div className="account-field">
                        <Link
                          to="/dashboard/notifications"
                          className="account-field-link"
                        >
                          <div className="separator"></div>
                          <div style={{ display: "flex" }}>
                            <span className="span">Notifications</span>
                            {user.notification.notificationsRemaining != 0 && (
                              <p style={{ color: "red" }}>
                                + {user.notification.notificationsRemaining}
                              </p>
                            )}
                          </div>
                        </Link>
                      </div>
                      <div className="account-field">
                        <Link
                          to="/dashboard/activity"
                          className="account-field-link"
                        >
                          <div className="separator"></div>
                          <span className="span">Activity</span>
                        </Link>
                      </div>
                      {user.role && user.role.admin && (
                        <div className="account-field">
                          <Link to="/admin/analytics" className="account-field-link">
                            <div className="separator"></div>
                            <span>Admin Features 💼</span>
                          </Link>
                        </div>
                      )}
                      <div className="account-field">
                        <Link to={"/dashboard/order"} className="account-field-link">
                          <div className="separator"></div>
                          <span>My Orders</span>
                        </Link>
                      </div>
                      <div className="account-field" onClick={logoutUser}>
                        <Link to={"/"} className="account-field-link">
                          <div className="separator"></div>
                          <span>Logout</span>
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                <Link to="/auth/signup" className="btn btn-secondary">
                  <span className="text-1">Login</span>
                  <span className="text-2" aria-hidden="true">
                    Sign Up!
                  </span>
                </Link>
                <Link to="/auth/signup" className="signin-text">
                  Sign in
                </Link>
              </>
            )}


            <button
              className={`nav-open-btn ${navToggler}`}
              aria-label="open menu"
              data-nav-toggler
              onClick={toggleNavBar}
            >
              <span className="line line-1"></span>
              <span className="line line-2"></span>
              <span className="line line-3"></span>
            </button>
          </div>

          <div
            className={`overlay ${navToggler}`}
            data-nav-toggler
            data-overlay
          ></div>
        </div>
      </header>
    </>
  );
});
