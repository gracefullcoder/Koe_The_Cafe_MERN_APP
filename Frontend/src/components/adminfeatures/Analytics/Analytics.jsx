import React, { useEffect, useState, useMemo } from 'react'
import { getData } from "../../../helperfunction.js";
import { Outlet } from 'react-router-dom';
import { recentData, mapMonthly, mapYearly, mapWeekly } from './AnalyticsFunctions';


function Analytics() {
    let [analytics, setAnalytics] = useState({ menus: [], users: [], mails: [], orders: [], traffic: [] });
    useEffect(() => {
        async function getAnalyticsData() {
            const analyticsData = await getData("traffic/analytics")
            console.log(analyticsData);
            setAnalytics({ ...analyticsData });
        }

        getAnalyticsData();
    }, [])

    const recentOrders = useMemo(() => recentData(analytics.orders), [analytics.orders]);
    const weeklyMappedOrders = useMemo(() => mapWeekly(analytics.orders), [analytics.orders]);
    const monthlyMappedOrders = useMemo(() => mapMonthly(analytics.orders), [analytics.orders]);
    const yearlyMappedOrders = useMemo(() => mapYearly(analytics.orders), [analytics.orders]);
    
    return (
        <section className='analytics-sections'>
            <div className="title">
                <i className="uil uil-tachometer-fast-alt"></i>
                <span className="text">Analytics</span>
            </div>

            <Outlet
                context={{
                    menusAnalytics: analytics.menus,
                    usersAnalytics: analytics.users,
                    mailsAnalytics: analytics.mails,
                    ordersAnalytics: analytics.orders,
                    trafficAnalytics: analytics.traffic,
                    analytics,
                    setAnalytics,
                    recentOrders, weeklyMappedOrders, monthlyMappedOrders, yearlyMappedOrders
                }} />
        </section>
    )
}

export default Analytics