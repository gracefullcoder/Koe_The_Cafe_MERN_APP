import React, { useEffect, useState, memo } from "react";
import SpecialitySlider from "./SpecialitySlider";

function Specialities({ specialSliders }) {
  // console.log("speciality section  is called")
  let [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const autoSlide = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % specialSliders.length);
    }, 7000);

    return () => clearInterval(autoSlide);
  }, [specialSliders]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + specialSliders.length) % specialSliders.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % specialSliders.length);
  };

  return (
    <section className="speciality" id="specialities">
      <div className="special-slider">
        {specialSliders && specialSliders.map((speciality, index) => (
          <SpecialitySlider speciality={speciality} key={speciality._id || index} isActive={currentSlide == index ? true : false} />
        ))}
      </div>


      <img
        src="https://ik.imagekit.io/vaibhav11/shape-9.png?updatedAt=1707734962408"
        loading="lazy"
        alt=""
        className="shape shape-2"
      />
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
    </section>
  );
}

export default memo(Specialities);
