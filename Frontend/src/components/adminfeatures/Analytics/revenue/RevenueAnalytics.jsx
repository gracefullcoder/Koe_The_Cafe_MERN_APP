import React, { memo, useMemo } from 'react';
import AnalyticsCard from '../AnalyticsCard';
import { monthData } from '../AnalyticsFunctions';

const orderRevenue = (orderDetail) => {
    if (orderDetail.status == "Cancelled") return 0;
    else {
        return orderDetail.orders.reduce((orderTotal, order) => {
            if (order.status == "Cancelled") return orderTotal;
            else {
                return orderTotal + order.quantity * order.dish.price;
            }
        }, 0)
    }
}

const generateRecentRevenue = (recentOrders) => {
    const todayRevenue = recentOrders.todayData.reduce((acc, order) => acc + orderRevenue(order), 0) || 0;
    const yesterdayRevenue = recentOrders.yesterdayData.reduce((acc, order) => acc + orderRevenue(order), 0) || 0;
    const dayBefYesRevenue = recentOrders.dayBefYestData.reduce((acc, order) => acc + orderRevenue(order), 0) || 0;

    const percentChange = dayBefYesRevenue
        ? ((yesterdayRevenue - dayBefYesRevenue) / dayBefYesRevenue) * 100
        : 0;

    return { todayRevenue, percentChange };
}

const generateRecentMonthRevenue = (monthlyOrdersMap) => {
    const currDate = new Date();
    const currYear = currDate.getFullYear();
    const currMonth = currDate.getMonth() + 1;

    const currMonthOrders = monthlyOrdersMap.get(`${currMonth}-${currYear}`) || [];
    const pastMonthOrders = monthlyOrdersMap.get(`${currMonth - 1 || 12}-${currYear}`) || [];
    const befPastMonthOrders = monthlyOrdersMap.get(`${currMonth - 2 || 12}-${currYear}`) || [];

    const currMonthRevenue = currMonthOrders.reduce((acc, order) => acc + orderRevenue(order), 0) || 0;
    const pastMonthRevenue = pastMonthOrders.reduce((acc, order) => acc + orderRevenue(order), 0) || 0;
    const befPastMonthRevenue = befPastMonthOrders.reduce((acc, order) => acc + orderRevenue(order), 0) || 0;

    const monthlyPercentChange = befPastMonthRevenue
        ? ((pastMonthRevenue - befPastMonthRevenue) / befPastMonthRevenue) * 100
        : 0;

    return { currMonthRevenue, monthlyPercentChange };
}

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



function RevenueCards({ revenueAnalytics, recentOrders, monthlyMappedOrders }) {
    console.log(recentOrders.todayData.length);
    const { currMonthRevenue, monthlyPercentChange } = generateRecentMonthRevenue(monthlyMappedOrders);
    const { todayRevenue, percentChange } = generateRecentRevenue(recentOrders);


    return (
        <>
            <AnalyticsCard
                analyticsData={{
                    title: "Today Revenue",
                    value: `${todayRevenue} /-`,
                    iconClass: "uil uil-bill",
                    percent: percentChange
                }}

                downloadData={{ fileName: "TodayRevenue", data: downloadOrders(recentOrders.todayData) }}

                detailedLink={"/admin/analytics/revenue"}
            />

            <AnalyticsCard
                analyticsData={{
                    title: "Montly Revenue",
                    value: `${currMonthRevenue} /-`,
                    iconClass: "uil uil-bill",
                    percent: monthlyPercentChange,
                }}

                downloadData={{ fileName: "MonthlyRevenue", data: downloadOrders(monthData(monthlyMappedOrders)) }}
                detailedLink={"/admin/analytics/revenue"}

            />

            <AnalyticsCard
                analyticsData={{
                    title: "Total Revenue",
                    value: `${revenueAnalytics.reduce((acc, order) => acc + order.totalAmount, 0)} /-`,
                    iconClass: "uil uil-bill",
                    percent: 0,
                }}

                downloadData={{ fileName: "TotalRevenue", data: downloadOrders(revenueAnalytics) || [] }}
                detailedLink={"/admin/analytics/revenue"}
            />




        </>
    )
}

export default memo(RevenueCards);