import React, { useState, useEffect } from 'react';
import DashBoardSection from "../DashBoardSection";
import { DashBoardNavbar } from '../DashBoardNavbar';
import UserNavLinks from './UserNavLinks';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../context/AuthContext';
import { toastMessage } from '../../../helperfunction';

function UserDashboard() {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
      toastMessage({ success: false, message: "Log in to access dashboard!" })
    }
  }, [user])

  const [close, setClose] = useState("");

  function toggleClose() {
    setClose((prev) => (prev === "" ? "close" : ""));
  }

  return (
    <>
      {
        user && (
          <>
            <DashBoardNavbar close={close} toggleClose={toggleClose} navLinksList={<UserNavLinks />} navTitle={'Profile'} />
            <DashBoardSection close={close} toggleClose={toggleClose} />
          </>
        )
      }
    </>
  )
}

export default UserDashboard;