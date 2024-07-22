import React, { useMemo } from 'react';
import AnalyticsCard from '../AnalyticsCard';

const downloadOrders = (ordersData) => {
    let formattedData = [];
    ordersData.forEach((order) => {
        formattedData.push({
            orderId: order._id,
            userId: order.user,
            orderStatus: order.status,
            createdAt: order.createdAt,
            paymentMethod: order.paymentMethod,
            totalAmount: order.totalAmount
        });

        order.orders.forEach(order => {
            formattedData.push({
                orderId: "", orderStatus: "", createdAt: "", paymentMethod: "",
                dishName: order.dish.dishName, price: order.dish.price, quantity: order.quantity, status: order.status
            })
        })
    })

    return formattedData;
}

const generateRecentMonthRevenue = (monthlyOrdersMap) => {
    const currDate = new Date();
    const currYear = currDate.getFullYear();
    const currMonth = currDate.getMonth() + 1;

    const currMonthOrders = monthlyOrdersMap.get(`${currMonth}-${currYear}`) || [];
    const pastMonthOrders = monthlyOrdersMap.get(`${currMonth - 1 || 12}-${currYear}`) || [];
    const befPastMonthOrders = monthlyOrdersMap.get(`${currMonth - 2 || 12}-${currYear}`) || [];


    const monthlyOrderPercentChange = befPastMonthOrders.length
        ? ((pastMonthOrders.length - befPastMonthOrders.length) / befPastMonthOrders.length) * 100
        : 0;

    return { currMonthOrders, monthlyOrderPercentChange };
}
    

function OrdersAnalytics({ ordersAnalytics, recentOrders, monthlyMappedOrders }) {

    console.log(recentOrders.todayData.length);
    const { currMonthOrders, monthlyOrderPercentChange } = useMemo(() => generateRecentMonthRevenue(monthlyMappedOrders), [monthlyMappedOrders]);

    return (
        <>
            <AnalyticsCard
                analyticsData={{
                    title: "Today Orders",
                    value: recentOrders.todayData.length,
                    iconClass: "uil uil-parcel",
                    percent: recentOrders.dayBefYestData.length ? ((recentOrders.yesterdayData.length - recentOrders.dayBefYestData.length) / recentOrders.dayBefYestData.length) * 100 : 0,
                }}
                detailedLink={"/admin/analytics/orders"}

                downloadData={{ fileName: "TodayOrders", data: downloadOrders(recentOrders.todayData) }}

            />

            <AnalyticsCard
                analyticsData={{
                    title: "Monthly Orders",
                    value: currMonthOrders.length,
                    iconClass: "uil uil-parcel",
                    percent: monthlyOrderPercentChange,
                }}
                detailedLink={"/admin/analytics/orders"}

                downloadData={{ fileName: "MonthlyOrders", data: downloadOrders(recentOrders.todayData) }}

            />

            <AnalyticsCard
                analyticsData={{
                    title: "Total Orders",
                    value: ordersAnalytics.length,
                    iconClass: "uil uil-parcel",
                    percent: 0,
                }}
                detailedLink={"/admin/analytics/orders"}

                downloadData={{ fileName: "AllOrders", data: downloadOrders(ordersAnalytics) || [] }}

            />
        </>
    )
}

export default OrdersAnalytics