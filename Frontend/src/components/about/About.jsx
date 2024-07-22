import React from "react";
import koeLine from "../../assets/images/koe line.jpg";
import koeLogo from "../../assets/images/koe-logo.png";
import { linkVisited } from "../../helperfunction";

const AboutSection = () => {
  return (
    <section
      className="section about text-center"
      aria-labelledby="about-label"
      id="about"
    >
      <div className="container about-container">
        <figure className="about-banner" id="slideshow-container">
          <div className="banner-container">
            <img
              className="banner-image"
              src={koeLine}
              loading="lazy"
              alt="Koe line"
            />
            <img src={koeLogo} className="abs-img" loading="lazy" alt="Koe logo" />
          </div>
        </figure>
        <div className="about-content">
          <p className="label-2 section-subtitle" id="about-label">
            Our Story
          </p>
          <h2 className="headline-1 section-title">
            Every Flavor Tells a Story
          </h2>
          <p className="section-text">
            <br />
            Bonjour Surat! Visit our café to experience the finest French
            cuisine and the allure of a French café.
            <br />
            <br />
            Bringing to you, a <b>state-of-the-art Coffee Roastery</b> at Koe’s
            Rooftop Kafe! ☕️✨
            <br />
            <br />
            The inception of Kôė was to create a micro scale coffee roasting and
            food curation experience, with a serene ambience to make the whole
            experience a complete package for the clientele.
          </p>
          <div className="contact-label">Book Through Call</div>
          <a
            href="tel:+919624696846"
            className="body-1 contact-number hover-underline"
            onClick={(event) => linkVisited(event, "Contact")}
          >
            +91 96246 96846
          </a>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
