import React, { useState } from 'react';
import DashBoardSection from "../DashBoardSection";
import { DashBoardNavbar } from '../DashBoardNavbar';
import UserNavLinks from './UserNavLinks';

function UserDashboard() {
  const [close, setClose] = useState("");

  function toggleClose() {
    setClose((prev) => (prev === "" ? "close" : ""));
  }

  return (
    <>
      <DashBoardNavbar close={close} toggleClose={toggleClose} navLinksList={<UserNavLinks />} navTitle={'Profile'}/>
      <DashBoardSection close={close} toggleClose={toggleClose} />
    </>
  )
}

export default UserDashboard;