import React, { useState } from 'react';
import DashBoardSection from "../DashBoardSection";
import { DashBoardNavbar } from '../DashBoardNavbar';
import AdminNavLinks from './AdminNavLinks';

function AdminDashBoard() {
  const [close, setClose] = useState("");

  function toggleClose() {
    setClose((prev) => (prev === "" ? "close" : ""));
  }

  return (
    <>
      <DashBoardNavbar close={close} toggleClose={toggleClose} navTitle={'Admin'} navLinksList={<AdminNavLinks/>}/>
      <DashBoardSection close={close} toggleClose={toggleClose} />
    </>
  )
}

export default AdminDashBoard;