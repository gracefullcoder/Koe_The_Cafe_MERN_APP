import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContext.jsx";
import maleIcon from "../../../assets/images/male.png";
import femaleIcon from "../../../assets/images/female.png";
import { toastMessage } from "../../../helperfunction.js";
import { toast } from "react-toastify";

function UserDetails() {
  const { user, setUser } = useAuthContext();
  const [tempUser, setTempUser] = useState({ fullname: user.fullname, gender: user.gender, DOB: user.DOB, myFile: "" });
  let [makeChange, setMakeChange] = useState(false);
  const [fileName, setFileName] = useState("");
  const navigate = useNavigate();

  console.log(user);

  useEffect(() => {
    if (!user) {
      navigate("/auth/login");
    }
  }, []);

  function toggleChange() {
    setMakeChange(true);
  }

  function handleInputChange(event) {
    setTempUser((prevData) => ({ ...prevData, [event.target.name]: event.target.value }))
  }

  function handleFileChange(event) {
    toggleChange();
    handleInputChange(event);
    setFileName(event.target.files[0].name);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const updationUrl = `${import.meta.env.VITE_SERVER_ENDPOINT}/dashboard/edit/${user._id}`;
      const formBody = new FormData(event.target);
      const fetchUser = await fetch(updationUrl, {
        method: "PATCH",
        credentials: "include",
        body: formBody
      })

      const responseData = await fetchUser.json();

      if (fetchUser.ok) {
        setMakeChange(false);
        setFileName("");
        setUser(responseData.user);
      }

      console.log(responseData);
      toastMessage(responseData);
    }
    catch (error) {
      console.log(error);
      toast.error(error);
    }
  }


  return (
    <div className="dash-content">
      <div className="title">
        <i className="uil uil-tachometer-fast-alt"></i>
        <span className="text">Dashboard</span>
      </div>
      <div className="user-content">
        <form
          id="user-form"
          encType="multipart/form-data"
          onSubmit={handleSubmit}
        >
          <div className="user-details">
            <div>
              <h3 className="user-details-label">Username:</h3>
              <p className="user-input-nochange user-input">{user.username}</p>
            </div>

            <div>
              <h3 className="user-details-label">Name:</h3>
              <input
                id="user-input"
                type="text"
                name="fullname"
                className="user-input input-field"
                onChange={handleInputChange}
                value={tempUser.fullname}
                disabled={!makeChange}
                required
              />
            </div>
            <div>
              <h3 className="user-details-label">Gender:</h3>
              <div className="gender-selection">
                <label className="gender-option">
                  <input
                    id="user-input"
                    type="radio"
                    name="gender"
                    value="Male"
                    className="input-field"
                    onChange={handleInputChange}
                    disabled={!makeChange}
                    checked={tempUser.gender == "Male" ? "checked" : ""}
                    required
                  />
                  <img
                    src={maleIcon}
                    height="40rem"
                    width="40rem"
                    alt="Male"
                    className="icon"
                  />
                  <p>Male</p>
                </label>
                <label className="gender-option">
                  {/* style={{ backgroundColor: user.gender === 'Female' ? '#ff69b4' : 'transparent' }}> */}
                  <input
                    id="user-input"
                    type="radio"
                    name="gender"
                    value="Female"
                    className="input-field"
                    onChange={handleInputChange}
                    disabled={!makeChange}
                    checked={tempUser.gender == "Female" ? "checked" : ""}
                    required
                  />
                  <img
                    src={femaleIcon}
                    height="40rem"
                    width="40rem"
                    alt="Female"
                    className="icon"
                  />
                  <p>Female</p>
                </label>
              </div>
            </div>
            <div>
              <h3 className="user-details-label">Date Of Birth:</h3>
              <input
                id="user-input"
                type="date"
                name="DOB"
                className="user-input input-field"
                onChange={handleInputChange}
                value={tempUser.DOB.toString().slice(0, 10)}
                disabled={!makeChange}
                required
              />
            </div>
            {makeChange ? (
              <div className="update-button">
                <button
                  className="buttonuser btn btn-secondary"
                  role="button"
                  disabled={!makeChange}
                >
                  <span className="text text-1">Update</span>
                  <span className="text text-2">Update</span>
                </button>
              </div>
            ) : (
              <button
                className="buttonuser btn btn-secondary"
                role="button"
                onClick={toggleChange}
              >
                <span className="text text-1">Make Changes!</span>
                <span className="text text-2">Make Changes!</span>
              </button>
            )}
          </div>


          <div className="profile-picture">
            <h3 className="profile-picture-label">Profile Picture</h3>
            <div className="profile-image">
              <label>
                <img src={user.profilepicture.imagelink} alt="profile" />
                <label className="file-input-label btn btn-secondary">
                  Upload
                  <input
                    type="file"
                    id="user-input"
                    name="myFile"
                    value={tempUser.myFile}
                    onChange={handleFileChange}
                  />
                </label>
              </label>
            </div>
            <p style={{ maxWidth: "24rem" }}>{fileName}</p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserDetails;
