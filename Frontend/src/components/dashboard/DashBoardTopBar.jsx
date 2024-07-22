import React from 'react'

function DashBoardTopBar({ toggleClose }) {
  return (
    <div className="top">
      <i className="uil uil-bars sidebar-toggle" onClick={toggleClose}></i>

      {/* <div class="search-box">
            <i class="uil uil-search"></i>
            <input type="text" placeholder="Search here..." />
          </div> */}
      {/* <div>
            Home
          </div>
          <div>
            profilepicture
          </div> */}

      {/* <img src="images/profile.jpg" alt=""> */}
    </div>
  )
}

export default DashBoardTopBar;