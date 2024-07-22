import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../footer/Footer.jsx";
import { SecondaryButton } from "../reuseable/Button.jsx";
import { handleInputChangeObj } from "../adminfeatures/CustomizationAssets/CustomizationFunction.js";
import { toastMessage } from "../../helperfunction.js";
import { useAuthContext } from "../../context/AuthContext.jsx";

function AddTestimonial() {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
      toastMessage({ success: true, message: "Log In to add testimonial!" })
    }
  }, [user]);

  let [testimonial, setTestimonial] = useState({
    review: "",
    suggestion: "",
    myFile: ""
  });

  useEffect(() => {
    window.scroll(0, 0);
  }, [])

  async function handleTestimonial(event) {
    try {
      event.preventDefault();
      let formData = new FormData(event.target);

      let testimonialUrl = `${import.meta.env.VITE_SERVER_ENDPOINT}/testimonial`;
      let addTestimonial = await fetch(testimonialUrl, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      let response = await addTestimonial.json();

      toastMessage(response);
      if (addTestimonial.ok) {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toastMessage(error);
    }
  }

  return (
    <>
      {
        user && (
          <>
            <section className="section form-section text-center" >
              <div className="container">
                <h2 className="headline-1 section-title text-center">
                  We'd Love to Hear From You!
                </h2>
                <br />
                <p className="text-center title-1">
                  Your feedback is important to us. Please take a moment to share your
                  experience and thoughts about our services.
                </p>

                <form encType="multipart/form-data" onSubmit={handleTestimonial} className="testimonial-form">
                  <div className="must-field-container">
                    <p className="field-label">
                      Your Review
                    </p>
                    <input
                      type="text"
                      name="review"
                      className='input-field'
                      placeholder="REVIEW"
                      value={testimonial.review}
                      onChange={(event) => handleInputChangeObj(event, setTestimonial)}
                      required
                    />
                    <p className="must-field">
                      *
                    </p>
                  </div>
                  <p className="field-label">
                    Any Suggestions
                  </p>
                  <input
                    type="text"
                    id="suggestion"
                    name="suggestion"
                    className='input-field'
                    placeholder="SUGGESTION"
                    value={testimonial.suggestion}
                    onChange={(event) => handleInputChangeObj(event, setTestimonial)}
                  />
                  {!user.profilepicture.isUpdated &&
                    <>
                      <p className="field-label">
                        Update Your Profile Picture
                      </p>
                      <input
                        type="file"
                        id="myFile"
                        name="myFile"
                        className='input-field'
                        value={testimonial.myFile}
                        onChange={(event) => handleInputChangeObj(event, setTestimonial)}
                      />
                    </>
                  }

                  <SecondaryButton text1={"Add Testimonial"} text2={"Submit!"} />
                </form>
              </div>
            </section>
            <Footer />
          </>
        )
      }
    </>
  );
}

export default AddTestimonial;
