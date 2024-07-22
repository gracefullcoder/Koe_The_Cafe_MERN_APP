import React, { memo, useMemo } from 'react';
import AnalyticsCard from '../AnalyticsCard';
import { recentData } from '../AnalyticsFunctions';

const recentTrafficReport = (recentTraffic) => {
    const todayTraffic = recentTraffic.todayData.length;
    const yesterdayTraffic = recentTraffic.yesterdayData.length;
    const dayBefYesTraffic = recentTraffic.dayBefYestData.length;

    const percentChange = dayBefYesTraffic
        ? ((yesterdayTraffic - dayBefYesTraffic) / dayBefYesTraffic) * 100
        : 0;

    return { todayTraffic, percentChange };
}


const downloadTrafficData = (trafficData) => {

    return trafficData.map((traffic) => {
        return { ...traffic, dishAdded: JSON.stringify(traffic.dishAdded), "__V": null };
    })
}

function TrafficAnalytics({ trafficAnalytics }) {

    const recentTraffic = useMemo(() => recentData(trafficAnalytics), [trafficAnalytics]);

    const { todayTraffic, percentChange } = recentTrafficReport(recentTraffic);

    return (
        <>
            <AnalyticsCard
                analyticsData={{
                    title: "Recent Traffic",
                    value: todayTraffic,
                    iconClass: "uil uil-presentation-line",
                    percent: percentChange,
                }}

                downloadData={{ fileName: "TrafficAnalytics", data: recentTraffic.todayData.map((data) => ({ ...data, dishAdded: JSON.stringify(data.dishAdded) })) }}

                detailedLink={"/admin/analytics/traffic"}
            />

            <AnalyticsCard
                analyticsData={{
                    title: "Traffic Received",
                    value: trafficAnalytics.length,
                    iconClass: "uil uil-presentation-line",
                    percent: 0,
                }}

                downloadData={{ fileName: "TrafficAnalytics", data: downloadTrafficData(trafficAnalytics) }}

                detailedLink={"/admin/analytics/traffic"}
            />
        </>
    )
}

export default memo(TrafficAnalytics);