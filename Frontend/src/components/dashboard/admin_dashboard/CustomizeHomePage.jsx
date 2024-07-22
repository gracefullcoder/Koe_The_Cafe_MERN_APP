import React from 'react'
import CustomizeBox from "./CustomizerBox";

function CustomizeHomePage() {

    return (
        <>
            <div className="title"><i className="uil uil-tachometer-fast-alt"></i><span className="text">Customize Homepage</span></div>
            <div className='customize-options'>
                <CustomizeBox title={'HeroSection Customizer'} iconClass={'uil uil-web-section'} buttonText={'Customize!'} link={"/admin/customize/Hero"} />
                <CustomizeBox title={'Speciality Customizer'} iconClass={'uil uil-trophy'} buttonText={'Customize!'} link={"/admin/customize/Speciality"} />
                <CustomizeBox title={'Manage Events'} iconClass={'fa-solid fa-champagne-glasses'} buttonText={'Manage!'} link={"/admin/customize/Event"} />
                <CustomizeBox title={'View And Manage Testimonial'} iconClass={'fa-regular fa-message'} buttonText={'Customize!'} link={"/admin/customize/Testimonial"} />
                {/* <CustomizeBox title={'Customize Workshop'} iconClass={'uil uil-coffee'} buttonText={'Manage!'} link={"/admin/customizeWorkshop"} /> */}
            </div>
        </>
    )
}

export default CustomizeHomePage