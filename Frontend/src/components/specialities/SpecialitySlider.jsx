import React,{memo} from "react";
import badge from "../../assets/images/badge-1.png";

function SpecialitySlider({speciality,isActive}) {

  // console.log("specialitysliders are called");
  return (
    <div
      className={`special-dish ${
        isActive ? "active" : "hide"
      } text-center`}
      aria-labelledby="dish-label"
    >
      <div className="special-dish-banner">
        <img
          src={speciality.image}
          loading="lazy"
          alt="special dish"
          className="special-img"
        />
      </div>

      <div className="special-dish-content bg-black-10">
        <div className="container">
          <img src={badge} loading="lazy" alt="badge" className="abs-img" />

          <p className="section-subtitle label-2">{speciality.label}</p>

          <h2 className="headline-1 section-title">{speciality.title}</h2>

          <p className="section-text">
            {speciality.text}
          </p>
        </div>
      </div>

      <img src="https://ik.imagekit.io/vaibhav11/Koe_Cafe/Additional/shape-4.png?updatedAt=1720483080805"
          loading="lazy"
          alt="Aesthetic Shape Chilli"
          className="shape shape-1"
        />
    </div>
  );
}

export default memo(SpecialitySlider);
