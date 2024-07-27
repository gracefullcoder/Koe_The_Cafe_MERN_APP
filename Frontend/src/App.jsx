import React, { useEffect, useState, useCallback } from "react";
import Header from "./components/header/Header.jsx";
import HeroSection from "./components/herosection/HeroSection.jsx";
import Workshop from "./components/workshop/Workshop.jsx";
import About from "./components/about/About.jsx";
import Footer from "./components/footer/Footer.jsx";
import Feature from "./components/features/Feature.jsx";
import Event from "./components/event/Event.jsx";
import Testimonial from "./components/testimonials/Testimonial.jsx";
import Reservation from "./components/reservation/Reservation.jsx";
import Specialities from "./components/specialities/Specialities.jsx";
import BackToTop from "./components/backtotop/BackToTop.jsx";
import MenuSection from "./components/menusection/MenuSection.jsx";
import { useLoaderData } from "react-router-dom";
import "./sass/main.scss";
import { pageVisited, toastMessage } from "./helperfunction.js";
import { toast } from "react-toastify";
import { Cart } from "./components/cart/Cart.jsx";

function App() {
  const [homePage, setHomePage] = useState({
    user: null,
    heroSliders: [],
    workshop: {},
    specialSection: [],
    events: [],
    testimonials: [],
  });


  const [user, setUser] = useState(false);
  
  let homePageData = useLoaderData(App.loader);

  useEffect(() => {
    setHomePage(homePageData);
    if (homePageData.user) setUser(true);

    pageVisited("HomePage")
  }, []);

  const handleLogout = useCallback(() => {
    setHomePage((prev) => ({ ...prev, user: null }));
    setUser(false);
  }, [])


  return (
    <>
      <Header user={homePage.user} onLogout={handleLogout} />
      <Cart />  
      <HeroSection heroSliders={homePage.heroSliders} />
      <MenuSection menus={homePage.menus} />
      <Workshop
        workshop={homePage.workshop}
        isWorkshop={homePage.isWorkshop}
        isUser={user}
      />
      <About />
      <Specialities specialSliders={homePage.specialSection} />
      <Reservation isUser={user} userId={user && homePage.user._id} />
      <Feature />
      <Event events={homePage.events} />
      <Testimonial
        testimonials={homePage.testimonials}
        isUser={user}
        isTestimonial={user && homePage.user.testimonial ? true : false} />
      <Footer />
      <BackToTop />
    </>
  );
}

App.loader = async function getHomePage() {
  try {
    const URL = `${import.meta.env.VITE_SERVER_ENDPOINT}`;
    const fetchHomePage = await fetch(URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const homePageData = await fetchHomePage.json();
    if (fetchHomePage.ok) {
      return homePageData;
    } else {
      toastMessage(homePageData)
      return 0;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    toast.error("Failed to load Data!", {
      position: "top-center",
      autoClose: 1000,
    });
    return 0;
  }
};

export default App;
