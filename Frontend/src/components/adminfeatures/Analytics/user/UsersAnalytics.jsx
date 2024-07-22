import React, { memo, useMemo } from 'react'
import AnalyticsCard from '../AnalyticsCard';
import { recentData, mapYearly, mapWeekly, mapMonthly } from '../AnalyticsFunctions';

const generateRecentUsers = (recentUsers) => {
    const todayUsers = recentUsers.todayData.length;
    const yesterdayUsers = recentUsers.yesterdayData.length;
    const dayBefYesUsers = recentUsers.dayBefYestData.length;

    const percentChange = dayBefYesUsers
        ? ((yesterdayUsers - dayBefYesUsers) / dayBefYesUsers) * 100
        : 0;

    return { todayUsers, percentChange };
}

const downloadUsers = (usersData) => {
    let formattedData = usersData.map((data) => (
        {
            userId: data._id,
            joinedAt: data.createdAt,
            fullName: data.fullname,
            username: data.username,
            gender: data.gender,
            Date_Of_Birth: data.DOB,
            Notification: JSON.stringify(data.notification),
            workshopsRegisterd: JSON.stringify(data.workshopsRegisterd),
            bookings: JSON.stringify(data.bookings),
            cart: JSON.stringify(data.cart)
        })
    )

    return formattedData;
}



function UsersAnalytics({ userAnalytics }) {

    const recentUsers = useMemo(() => recentData(userAnalytics), [userAnalytics]);
    const { todayUsers, percentChange } = useMemo(() => generateRecentUsers(recentUsers), [recentUsers]);

    return (
        <>
            <AnalyticsCard
                analyticsData={{
                    title: "New Clients",
                    value: todayUsers,
                    iconClass: "uil uil-users-alt",
                    percent: percentChange,
                }}

                downloadData={{ fileName: "Users", data: downloadUsers(recentUsers.todayData) }}
                detailedLink={"/admin/analytics/user"}
            />

            <AnalyticsCard
                analyticsData={{
                    title: "Total Users",
                    value: userAnalytics.length,
                    iconClass: "uil uil-users-alt",
                    percent: 0,
                }}
                downloadData={{ fileName: "Users", data: downloadUsers(userAnalytics) }}
                detailedLink={"/admin/analytics/user"}
            />

            

        </>
    )
}

export default memo(UsersAnalytics);