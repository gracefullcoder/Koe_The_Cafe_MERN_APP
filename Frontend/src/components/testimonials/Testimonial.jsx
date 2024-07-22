import { memo, useEffect, useState } from "react";
import TestimonialSlider from "./TestimonialSlider";

export default memo(function Testimonial({ testimonials, isUser,isTestimonial }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const autoSlide = setInterval(() => {
      setCurrentSlide((prev) => {
        return (prev + 1) % testimonials.length;
      });
    }, 7000);

    return () => clearInterval(autoSlide);
  }, [testimonials]);

  const handlePrev = () => {
    setCurrentSlide((prev) => {
      return (prev - 1 + testimonials.length) % testimonials.length;
    });
  };

  const handleNext = () => {
    setCurrentSlide((prev) => {
      return (prev + 1) % testimonials.length;
    });
  };

  return (
    <section className="testimonial text-center" aria-label="testimonials" id="testimonials">
      <ul className="testimonial-slider" data-testi-slider>
        {testimonials && testimonials.map((testimonial, index) => (
          <TestimonialSlider
            testimonial={testimonial}
            isUser={isUser}
            key={testimonial._id}
            isActive={index === currentSlide}
            isTestimonial={isTestimonial}
          />
        ))}
      </ul>
      
      <button
        className="slider-btn next"
        aria-label="slide to next"
        onClick={handleNext}
      >
        <ion-icon name="chevron-forward"></ion-icon>
      </button>

      <button
        className="slider-btn prev"
        aria-label="slide to previous"
        onClick={handlePrev}
      >
        <ion-icon name="chevron-back"></ion-icon>
      </button>
    </section>
  );
}
)