import React, { useState, useEffect, memo } from "react";
import HeroSlider from "./HeroSlider";
import bookTableImg from "../../assets/images/hero-icon.png";
import { actionPerformed, monitorActivity } from "../../helperfunction";

export default memo(function HeroSection({ heroSliders }) {

  let [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const autoSlide = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSliders.length);
    }, 7000);

    return () => clearInterval(autoSlide);
  }, [heroSliders]);

  const handlePrev = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroSliders.length) % heroSliders.length
    );
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSliders.length);
  };

  return (
    <section className="hero" aria-label="home" id="home">

      {/* custom data attribute data-* */}

      <ul className="hero-slider" data-hero-slider>
        {heroSliders.map((heroSlide, index) => (
          <HeroSlider slide={heroSlide} key={heroSlide._id || index} isActive={index == currentSlide ? true : false} />
        ))}
      </ul>

      <button
        className="slider-btn prev"
        aria-label="slide to previous"
        data-prev-btn
        onClick={handlePrev}
      >
        <ion-icon name="chevron-back"></ion-icon>
      </button>

      <button
        className="slider-btn next"
        aria-label="slide to next"
        data-next-btn
        onClick={handleNext}
      >
        <ion-icon name="chevron-forward"></ion-icon>
      </button>
      <a href="#reservation" className="hero-btn has-after" onClick={() => actionPerformed("Booking","Book a Table Attempted" )}>
        <img
          src={bookTableImg}
          width="48"
          height="48"
          alt="booking icon"
        />
        <span className="label-2 textCenter span">Book A Table</span>
      </a>
    </section>
  );
}
)