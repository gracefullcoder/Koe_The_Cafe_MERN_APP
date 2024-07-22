import React, { useCallback, useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom';
import BarGraph from '../BarGraph';
import LineGraph from '../LineGraph';
import { getMonthName, getWeekData, monthData } from '../AnalyticsFunctions';
import { LineChart } from '@mui/x-charts';
import OrderSummary from './OrderSummary';


const getMappedOrders = (mappedOrders) => {
    const interval = [];
    const intervalOrders = [];
    const cancelledOrders = [];
    for (let [key, value] of mappedOrders) {
        interval.push(key);
        intervalOrders.push(value.length);
        value.forEach((order) => {
            if (order.status == "Cancelled") cancelledOrders.push(order);
        })
    }

    return { interval, intervalOrders, cancelledOrders };
}

const generateOrderSummary = (recentOrders) => {
    const servingOrders = [];
    const servedOrders = [];
    const cancelledOrders = [];

    if (recentOrders.todayData) {
        recentOrders.todayData.forEach((order) => {
            order.status == "Cancelled" ? cancelledOrders.push(order) :
                order.status == "Served" ? servedOrders.push(order) :
                    servingOrders.push(order)
        })
    } else {
        recentOrders.forEach((order) => {
            order.status == "Cancelled" ? cancelledOrders.push(order) :
                order.status == "Served" ? servedOrders.push(order) :
                    servingOrders.push(order)
        })
    }


    return { servingOrders, servedOrders, cancelledOrders }
}



function orderDetailedAnalytics() {
    const { recentOrders, weeklyMappedOrders, monthlyMappedOrders, yearlyMappedOrders } = useOutletContext();
     const [summaryInterval, setSummaryInterval] = useState(0);



    const { servingOrders, servedOrders, cancelledOrders } = useMemo(() => {
        if (summaryInterval == 0) {
            console.log("in");
            return generateOrderSummary(recentOrders)
        }
        else if (summaryInterval == 1) {
            const orders = getWeekData(weeklyMappedOrders);
            return generateOrderSummary(orders)
        } else {
            const orders = monthData(monthlyMappedOrders);
            console.log(orders);
            return generateOrderSummary(orders)
        }
    }, [summaryInterval, recentOrders, monthlyMappedOrders,weeklyMappedOrders])

    const { interval: orderWeeks, intervalOrders: weeklyorder } = useMemo(() => getMappedOrders(weeklyMappedOrders), [weeklyMappedOrders])
    const { interval: orderMonths, intervalOrders: monthlyorder }= useMemo(() => getMappedOrders(monthlyMappedOrders), [monthlyMappedOrders])
    const { interval: orderYears, intervalOrders: yearlyOrder } = useMemo(() => getMappedOrders(yearlyMappedOrders), [yearlyMappedOrders])

    return (
        <section className='detailed-analytics'>
            <OrderSummary orderSummary={{ servingOrders, servedOrders, cancelledOrders }} intervalState={[summaryInterval,setSummaryInterval]}/>

            <LineGraph
                title={"Weekly order"}
                xAxisValue={orderWeeks}
                yAxisValue={weeklyorder}
            />

            <BarGraph
                title={"Monthly order"}
                xAxisValue={orderMonths.map((date) => (`${getMonthName(date[1] == '-' ? date[0] : date.slice(0, 2))}-${date.slice(-2)}`))}
                yAxisValue={monthlyorder}
            />

            <LineGraph
                title={"Yearly order"}
                xAxisValue={orderYears}
                yAxisValue={yearlyOrder}
            />

        </section>
    )
}

export default orderDetailedAnalytics