import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import DashBoardTopBar from "./DashBoardTopBar.jsx";
function DashBoardSection({close,toggleClose}) {

  return (
    <>
      <section className={`user-dashboard ${close}`} id="dashboard">
        <DashBoardTopBar toggleClose={toggleClose}/>
        <div className="overview">
          <Outlet />
        </div>
      </section>
    </>
  );
}

export default DashBoardSection;
