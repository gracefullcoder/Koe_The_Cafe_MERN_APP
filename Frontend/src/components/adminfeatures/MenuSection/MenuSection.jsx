import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { PrimaryButton } from '../../reuseable/Button'

function MenuSection() {

  const navigate = useNavigate();

  const navigateFnx = (route) => {
    navigate(route);
  }

  return (
    <>
      <div className="title"><i className="uil uil-tachometer-fast-alt"></i><span className="text">Manage Menu and Dishes</span></div>
      <p className='headline-1 text-center'>MenuSection</p>
      <div className="customize-method">
        <PrimaryButton text1={"Create Menu"} text2={"Let's Create"} fnx={() => navigateFnx("/admin/menu")} />
        <PrimaryButton text1={"Show Menu"} text2={"Let's See"} fnx={() => navigateFnx("/admin/menu/show")} />
        {/* <PrimaryButton/>
          <PrimaryButton/> */}
      </div>
      <Outlet />
    </>
  )
}

export default MenuSection