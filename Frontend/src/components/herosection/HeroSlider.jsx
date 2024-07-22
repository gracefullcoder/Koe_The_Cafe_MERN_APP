import React, { memo } from "react";
import menuPdf from "../../assets/KoeCafeFood.pdf";
import { actionPerformed } from "../../helperfunction";

const HeroSlider = memo(({ slide, isActive }) => {
  // console.log("heroslider is active")
  return (
    <li
      className={`slider-item ${isActive ? "active" : ""}`}
      data-hero-slider-item
    >
      <div className="slider-bg">
        <img
          src={slide.image}
          width="1880"
          height="950"
          alt="Hero slider Image"
          className="img-cover"
          loading="lazy"
        />
      </div>
      <p className="label-2 section-subtitle slider-reveal">{slide.label}</p>
      <h1 className="display-1 hero-title slider-reveal">{slide.title}</h1>
      <p className="body-2 hero-text slider-reveal">{slide.text}</p>
      <a
        href="#menu-section"
        className="btn btn-primary slider-reveal"
        onClick={() => actionPerformed("sectionLookup","Menus")}
      >
        <span className="text text-1">View Our Menu</span>
        <span className="text text-2" aria-hidden="true">
          View Our Menu
        </span>
      </a>
    </li>
  );
})

export default HeroSlider;
