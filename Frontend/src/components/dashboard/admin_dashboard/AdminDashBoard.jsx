import React, { useState, useEffect } from "react";
import DashBoardSection from "../DashBoardSection";
import { DashBoardNavbar } from "../DashBoardNavbar";
import AdminNavLinks from "./AdminNavLinks";
import { useAuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toastMessage } from "../../../helperfunction";

function AdminDashBoard() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user && user.role) {
      setIsAdmin(true);
    }
    else {
      navigate("/")
      toastMessage({ success: false, message: "Not an Admin User!" })
    }
  }, [user]);

  const [close, setClose] = useState("");

  function toggleClose() {
    setClose((prev) => (prev === "" ? "close" : ""));
  }

  return (
    <>
      {isAdmin && (
        <>
          <DashBoardNavbar
            close={close}
            toggleClose={toggleClose}
            navTitle={"Admin"}
            navLinksList={<AdminNavLinks />}
          />
          <DashBoardSection close={close} toggleClose={toggleClose} />
        </>
      )}
    </>
  );
}

export default AdminDashBoard;
