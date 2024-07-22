import React from 'react'
import { useOutletContext } from 'react-router-dom';
import BarGraph from '../BarGraph';
import LineGraph from '../LineGraph';
import { getMonthName } from '../AnalyticsFunctions';

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

const getMontlyRevenue = (monthlyOrders) => {
    let monthlyOrdersData = [...monthlyOrders];
    let monthlyRevenue = [];
    let revenueMonths = [];

    monthlyOrdersData.forEach(([month, ordersDetails]) => {
        console.log(month, ordersDetails);
        revenueMonths.push(month);
        const monthRevenue = ordersDetails.reduce((acc, orderDetail) => {
            return acc + orderRevenue(orderDetail);
        }, 0);

        monthlyRevenue.push(monthRevenue);
    })
    console.log(revenueMonths, monthlyRevenue);

    return { revenueMonths, monthlyRevenue };
}

const getYearlyRevenue = (yearlyOrders) => {
    let yearlyOrdersData = [...yearlyOrders];
    let yearlyRevenue = [];
    let revenueYears = [];

    yearlyOrdersData.forEach(([year, ordersDetails]) => {
        console.log(year, ordersDetails);
        revenueYears.push(year);
        const yearRevenue = ordersDetails.reduce((acc, orderDetail) => {
            return acc + orderRevenue(orderDetail);
        }, 0);

        yearlyRevenue.push(yearRevenue);
    })
    console.log(revenueYears, yearlyRevenue);

    return { revenueYears, yearlyRevenue };
}

const getWeeklyRevenue = (weeklyOrders) => {
    let weeklyOrdersData = [...weeklyOrders];
    let weeklyRevenue = [];
    let revenueWeeks = [];

    weeklyOrdersData.forEach(([week, ordersDetails]) => {
        console.log(week, ordersDetails);
        revenueWeeks.push(week);
        const weekRevenue = ordersDetails.reduce((acc, orderDetail) => {
            return acc + orderRevenue(orderDetail);
        }, 0);

        weeklyRevenue.push(weekRevenue);
    })
    console.log(revenueWeeks, weeklyRevenue);

    return { revenueWeeks, weeklyRevenue };
}


function RevenueDetailedAnalytics() {
    const {monthlyMappedOrders,yearlyMappedOrders,weeklyMappedOrders} = useOutletContext();

    const { revenueMonths, monthlyRevenue } = getMontlyRevenue(monthlyMappedOrders);
    const { yearlyRevenue, revenueYears } = getYearlyRevenue(yearlyMappedOrders);
    const { weeklyRevenue, revenueWeeks } = getWeeklyRevenue(weeklyMappedOrders);

    return (
        <section className='detailed-analytics'>
            <BarGraph
                title={"Monthly Revenue"}
                xAxisValue={revenueMonths.map((date) => (`${getMonthName(date[1] == '-' ? date[0] : date.slice(0, 2))}-${date.slice(-2)}`))}
                yAxisValue={monthlyRevenue}
            />

            <BarGraph
                title={"Yearly Revenue"}
                xAxisValue={revenueYears}
                yAxisValue={yearlyRevenue}
            />

            <LineGraph
                xAxisValue={revenueWeeks}
                yAxisValue={weeklyRevenue}
                title={"Weekly Revenue"}
            />
        </section>
    )
}

export default RevenueDetailedAnalytics