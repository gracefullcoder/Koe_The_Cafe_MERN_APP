import React, { useState } from 'react'
import CustomizerBox from '../../dashboard/admin_dashboard/CustomizerBox'
import { Outlet } from 'react-router-dom';
function CreateNotifications() {

    const [select, setSelect] = useState("select");

    return (
        <section>
            <div className="title"><i className="uil uil-tachometer-fast-alt"></i><span className="text">Create Notifications</span></div>
            {select === "select" && <div className="customize-options">
                <CustomizerBox title={"Website Notification"} iconClass={"fa-regular fa-message"} buttonText={"Create!"} link={"/admin/notification/website"} />
                <CustomizerBox title={"Push Notification"} iconClass={"fa-regular fa-bell"} buttonText={"Create!"} link={"/admin/notification/pushNotification"} />
                <CustomizerBox title={"Email Notification"} iconClass={"fa-regular fa-envelope"} buttonText={"Create!"} link={"/admin/notification/email"} />
                <CustomizerBox title={"All Notification Combined"} iconClass={"fa-regular fa-comments"} buttonText={"Create!"} link={"/admin/notification/all"} />
            </div>}
            <Outlet />
        </section>
    )
}

export default CreateNotifications