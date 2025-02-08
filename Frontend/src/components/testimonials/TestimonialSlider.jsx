import React, { memo } from "react";
import sliderBackground from "../../assets/images/testimonial-bg.jpg";
import { Link } from "react-router-dom";
import { pageVisited } from "../../helperfunction";
import { IKImage } from "imagekitio-react";


function TestimonialSlider({ testimonial, isUser, isActive, isTestimonial }) {
  return (
    <li
      className={`slider-item ${isActive ? "active" : ""}`}
      data-testi-slider-item
    >
      <div className="slider-bg">
        <img
          src={sliderBackground}
          width="1880"
          height="950"
          alt="Testimonial Slider Background"
          className="img-cover"
        />
      </div>

      <p className="label-2 section-subtitle">
        {testimonial.user.fullname}
      </p>

      <IKImage
        urlEndpoint='https://ik.imagekit.io/vaibhav11'
        src={testimonial.user.profilepicture.imagelink}
        className="profile-img"
        alt="testimonial-user-profile-image"
        transformation={[{
          quality: 100,
          height: 120,
          width: 120
        }]}
        loading="lazy"
      />

      <p className="headline-2 testimonial-text">{testimonial.review}</p>
      {isUser ? (
        isTestimonial ? (
          <></>
        ) : (
          <Link to="/testimonial" className="btn btn-secondary" onClick={() => pageVisited("Add Testimonial")}>
            <span className="text text-1">Add Testimonial!</span>

            <span className="text text-2" aria-hidden="true">
              Add Testimonial!
            </span>
          </Link>
        )
      ) : (
        <Link to="/auth/login" className="btn btn-secondary">
          <span className="text text-1">Add Testimonial!</span>

          <span className="text text-2" aria-hidden="true">
            Sign Up First!
          </span>
        </Link>
      )}
    </li>
  );
}

export default memo(TestimonialSlider);
