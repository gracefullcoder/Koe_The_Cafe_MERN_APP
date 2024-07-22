import React from 'react'
import AnalyticsCard from './AnalyticsCard.jsx';
import RevenueAnalytics from './revenue/RevenueAnalytics.jsx';
import UsersAnalytics from './user/UsersAnalytics.jsx';
import TrafficAnalytics from './traffic/TrafficAnalytics.jsx';
import { useOutletContext } from 'react-router-dom';
import OrdersAnalytics from './orders/OrdersAnalytics.jsx';

const donwloadMenus = (menus) => {
    const menuData = []
    menus.map((menu) => {
        menuData.push({ menuId: menu._id, name: menu.title, totalDishes: menu.dishes.length });
        menu.dishes.forEach(dish => {
            menuData.push({ ...dish, reviews: JSON.stringify(dish.reviews) })
        })
    });

    // console.log(menuData);
    return menuData;
}

function DashBoardAnalytics() {
    let { analytics, monthlyMappedOrders, recentOrders, yearlyMappedOrders, weeklyMappedOrders } = useOutletContext();

    return (

        <div className='analytics-dashboard'>

            <RevenueAnalytics revenueAnalytics={analytics.orders} monthlyOrders={monthlyMappedOrders} recentOrders={recentOrders} monthlyMappedOrders={monthlyMappedOrders} />

            <OrdersAnalytics ordersAnalytics={analytics.orders} recentOrders={recentOrders} weeklyMappedOrders={weeklyMappedOrders} monthlyMappedOrders={monthlyMappedOrders} yearlyMappedOrders={yearlyMappedOrders} />

            <UsersAnalytics userAnalytics={analytics.users} />

            <TrafficAnalytics trafficAnalytics={analytics.traffic} />

            <AnalyticsCard
                analyticsData={{
                    title: "Emails Sent",
                    value: analytics.mails.reduce((acc, mail) => acc + mail.usersMailId.length, 0),
                    iconClass: "fa-regular fa-envelope",
                    percent: 0,
                }}

                downloadData={{ fileName: "Mails", data: analytics.mails.map((mail) => ({ CreatedAt: mail.createdAt, title: mail.title, message: mail.title, HTMLContent: mail.htmlContent, usersMailId: JSON.stringify(mail.usersMailId) })) }}
            />


            <AnalyticsCard
                analyticsData={{
                    title: "Total Dishes",
                    value: analytics.menus.reduce((acc, menu) => (acc + menu.dishes.length), 0),
                    iconClass: "uil uil-coffee",
                    percent: 0,
                }}

                downloadData={{
                    fileName: 'dishes', data: donwloadMenus(analytics.menus)
                }}

                detailedLink={"/admin/analytics/review"}
            />



        </div>

    )
}

export default DashBoardAnalytics