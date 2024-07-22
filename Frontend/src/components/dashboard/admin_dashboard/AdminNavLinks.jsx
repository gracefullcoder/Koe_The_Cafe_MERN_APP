import React, { useState } from 'react'
import { DashBoardNavLink, DashBoardSubNavLink } from '../DashBoardNavbar';
function AdminNavLinks() {
    const [selectLink, setSelectLink] = useState(1);

    const handleSetSelect = (value) => {
        if (value != 0) {
            value == selectLink ? setSelectLink(null) : setSelectLink(value);
        }
    };

    return (
        <ul className="nav-links">
            <li>
                <DashBoardSubNavLink link={"/admin/analytics"} linkName={"Analytics"} iconClass={'uil uil-chart-line'} end={false} setSelect={{ state: handleSetSelect, value: 1 }} />

                <ul className={`sub-link ${selectLink === 1 ? 'active' : ''}`}>
                    <DashBoardNavLink
                        link="/admin/analytics"
                        iconClass="uil uil-web-section"
                        linkName="Dashboard"
                        end={true}
                        setSelect={{ state: handleSetSelect, value: 0 }}
                    />
                     <DashBoardNavLink
                        link="/admin/analytics/review"
                        iconClass="uil uil-coffee"
                        linkName="Dish Analytics"
                        end={true}
                        setSelect={{ state: handleSetSelect, value: 0 }}
                    />
                    
                    <DashBoardNavLink
                        link="/admin/analytics/traffic"
                        iconClass="uil uil-presentation-line"
                        linkName="Traffic Analytics"
                        end={true}
                        setSelect={{ state: handleSetSelect, value: 0 }}
                    />
                </ul>
            </li>
            <DashBoardNavLink link={"/admin/user"} linkName={"Manage Users"} iconClass={'uil uil-users-alt'} end={false} setSelect={{ state: handleSetSelect, value: 2 }} />
            <li>
                <DashBoardSubNavLink link={"/admin/customize"} linkName={"CMS"} iconClass={'uil uil-setting'} end={false} setSelect={{ state: handleSetSelect, value: 3 }} />

                <ul className={`sub-link ${selectLink === 3 ? 'active' : ''}`}>
                    <DashBoardNavLink
                        link="/admin/customize/hero"
                        iconClass="uil uil-web-section"
                        linkName="Hero Section"
                        end={true}
                        setSelect={{ state: handleSetSelect, value: 0 }}
                    />
                    <DashBoardNavLink
                        link="/admin/customize/speciality"
                        iconClass="uil uil-trophy"
                        linkName="Specialities"
                        end={true}
                        setSelect={{ state: handleSetSelect, value: 0 }}
                    />
                    <DashBoardNavLink
                        link="/admin/customize/event"
                        iconClass="fa-solid fa-champagne-glasses"
                        linkName="Events"
                        end={true}
                        setSelect={{ state: handleSetSelect, value: 0 }}
                    />
                    <DashBoardNavLink
                        link="/admin/customize/testimonial"
                        iconClass="fa-regular fa-note-sticky"
                        linkName="Testimonial"
                        end={true}
                        setSelect={{ state: handleSetSelect, value: 0 }}
                    />
                </ul>
            </li>
            <DashBoardNavLink link={"/admin/notification"} linkName={"Notification"} iconClass={'fa-regular fa-message'} end={false} setSelect={{ state: handleSetSelect, value: 4 }} />
            <DashBoardNavLink link={"/admin/menu"} linkName={"Menu & Dishes"} iconClass={'uil uil-restaurant'} end={false} setSelect={{ state: handleSetSelect, value: 5 }} />
            <DashBoardNavLink link={"/admin/order"} linkName={"Manage Order"} iconClass={'fa-regular fa-clipboard'} end={false} setSelect={{ state: handleSetSelect, value: 6 }} />
            <DashBoardNavLink link={"/admin/booking"} linkName={"Manage Booking"} iconClass={'fa-solid fa-chair'} end={false} setSelect={{ state: handleSetSelect, value: 7 }} />
            <DashBoardNavLink link={"/admin/workshop"} linkName={"ManageWorkshop"} iconClass={'fa-solid fa-chalkboard-user'} end={false} setSelect={{ state: handleSetSelect, value: 8 }} />
        </ul>
    )
}

export default AdminNavLinks;