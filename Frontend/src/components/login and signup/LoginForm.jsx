import React, { useState } from "react";
import { useNavigate ,Link} from "react-router-dom";
import { toast } from "react-toastify";
export default function LoginForm() {
  const navigate = useNavigate();

  let [loginCredentials, setloginCredentials] = useState({
    username: "",
    password: "",
  });

  let handelInputChange = (event) => {
    setloginCredentials((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  };

  async function handleSubmit(event) {
    try {
      event.preventDefault();
      const URL = `${import.meta.env.VITE_SERVER_ENDPOINT}/auth/login`;
      const fetchUser = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
          username: loginCredentials.username,
          password: loginCredentials.password,
        }),
        credentials: "include",
      });
      if (fetchUser.ok) {
        let userData = await fetchUser.json();
        toast.success(`Login SuccessFull! , Welcome Back ${userData.fullname}`, {
          position: "top-center",
          autoClose: 2000,
        });
        navigate("/");
      }else{
        toast.error(`Failed to Authenticate Incorrect Username or Password`,{
          position:"top-center",
          autoClose:3000,
        })
      }
    } catch {
      (err) => {
        console.log(err);
        toast.error("Failed to Authenticate", {
          position: "top-center",
          autoClose: 2000
        });
      };
    }
  }

  async function redirectToGoogle(event){
    event.preventDefault();
    window.open(`${import.meta.env.VITE_SERVER_ENDPOINT}/auth/login/google`,"_self");
  }
 
  
  return (
    <div className="loginForm">
      <div className="wrapper">
        <div className="title">Login Form</div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field">
            <input
              type="email"
              id="useremail"
              name="username"
              onChange={handelInputChange}
              value={loginCredentials.username}
              required
            />
            <label htmlFor="useremail">Email Address</label>
          </div>
          <div className="field">
            <input
              type="password"
              id="userpassword"
              name="password"
              onChange={handelInputChange}
              value={loginCredentials.password}
              required
            />
            <label htmlFor="userpassword">Password</label>
          </div>
          <span></span>
          <div className="field">
            <input type="submit" value="Login" />
          </div>
          <div className="field login-div">
            <button className="gsi-material-button" onClick={redirectToGoogle}>
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
                  Log in with Google
                </span>
              </div>
            </button>
          </div>
          <div className="signup-link">
            Not a member?
            <Link to="/auth/signup">Signup now</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
