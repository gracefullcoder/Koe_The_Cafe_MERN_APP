import React, { useState, useEffect } from "react";
import maleIcon from "../../assets/images/male.png";
import femaleIcon from "../../assets/images/female.png";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthContext } from "../../context/AuthContext";
import { toastMessage } from "../../helperfunction";

function GoogleSignup() {

  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
      toastMessage({ success: true, message: "Already Logged In!" })
    }
  }, [user])

  const [signupData, setSignupData] = useState({
    gender: "",
    DOB: "",
  });

  const [error, setError] = useState({
    genderError: "",
    dobError: "",
  });

  function handleSignupData(event) {
    const { name, value } = event.target;
    setSignupData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  function validateDOB() {
    if (!signupData.DOB) {
      setError((prevError) => ({
        ...prevError,
        dobError: "Please enter your date of birth",
      }));
      return false;
    } else {
      const currTime = new Date();
      const userDOB = new Date(signupData.DOB);
      if (currTime < userDOB) {
        setError((prevError) => ({
          ...prevError,
          dobError: "Oh! You hacker enjoying in stomach!",
        }));
        return false;
      }
    }
    setError((prevError) => ({
      ...prevError,
      dobError: "",
    }));
    return true;
  }

  function validateGender() {
    if (signupData.gender == "") {
      setError((prevError) => ({
        ...prevError,
        genderError: "Select Your Gender",
      }));
      return false;
    }
    setError((prevError) => ({
      ...prevError,
      genderError: "",
    }));
    return true;
  }

  function validateForm() {
    const isDOBValid = validateDOB();
    const isGenderValid = validateGender();
    return isDOBValid && isGenderValid;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!validateForm()) {
    } else {
      event.preventDefault();
      const signupUrl = `${import.meta.env.VITE_SERVER_ENDPOINT}/auth/signup/google`;
      let signupUser = await fetch(signupUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(signupData),
      });

      let responseData = await signupUser.json();
      if (signupUser.ok) {
        toast.success(responseData.message, {
          position: "top-center",
          autoClose: 2000,
        });
        redirectToGoogle();
      } else {
        toast.error("some error");
      }
    }
  }

  async function redirectToGoogle() {
    window.open(`${import.meta.env.VITE_SERVER_ENDPOINT}/auth/login/google`, "_self");
  }

  return (

    <div className="signupForm">
      {!user &&
        <div className="wrapper">
          <div className="auth-title">SignUp Form</div>
          <form className="auth-form" onSubmit={handleSubmit}>


            <div className="gender-selection">
              <label className="gender-option">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  onChange={handleSignupData}
                />
                <img src={maleIcon} alt="Male" className="icon" />
                <p>Male</p>
              </label>
              <label className="gender-option">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  onChange={handleSignupData}
                />
                <img src={femaleIcon} alt="Female" className="icon" /> Female
              </label>
            </div>

            <div id="genderError" className="auth-error">
              {error.genderError}
            </div>

            <p className="dob-heading">Date of Birth</p>

            <div className="field">
              <input
                type="date"
                name="DOB"
                id="DOB"
                value={signupData.DOB}
                onChange={handleSignupData}
                placeholder="Date of Birth"
                style={{ paddingRight: "1.6rem" }}
              />
            </div>
            <div id="dobError" className="auth-error">
              <p>{error.dobError}</p>
            </div>

            <div className="field login-div">
              <button className="gsi-material-button">
                <div className="gsi-material-button-state"></div>
                <div className="gsi-material-button-content-wrapper">
                  <div className="gsi-material-button-icon">
                    <svg
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 48 48"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      style={{ display: "block" }}
                    >
                      <path
                        fill="#EA4335"
                        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                      ></path>
                      <path
                        fill="#4285F4"
                        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                      ></path>
                      <path
                        fill="#FBBC05"
                        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                      ></path>
                      <path
                        fill="#34A853"
                        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                      ></path>
                      <path fill="none" d="M0 0h48v48H0z"></path>
                    </svg>
                  </div>
                  <span className="gsi-material-button-contents">
                    Sign up with Google
                  </span>
                  <span style={{ display: "none" }}>Sign up with Google</span>
                </div>
              </button>
            </div>

          </form>
        </div>
      }
    </div>


  );
}

export default GoogleSignup;
