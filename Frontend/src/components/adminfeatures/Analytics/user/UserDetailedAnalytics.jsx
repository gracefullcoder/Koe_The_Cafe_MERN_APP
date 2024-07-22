import React, { useMemo } from 'react'
import BarGraph from '../BarGraph';
import { mapWeekly, mapMonthly, mapYearly } from '../AnalyticsFunctions';
import { useOutletContext } from 'react-router-dom';

const getMappedUsers = (mappedUsers) => {
    const interval = [];
    const intervalUsers = [];
    for (let [key, value] of mappedUsers) {
        interval.push(key);
        intervalUsers.push(value.length);
    }

    return { interval, intervalUsers };
}

function UserDetailedAnalytics() {
    const { usersAnalytics } = useOutletContext();
    const yearlyMappedUsers = useMemo(() => mapYearly(usersAnalytics), [usersAnalytics]);
    const { interval: years, intervalUsers: yearlyUsers } = useMemo(() => getMappedUsers(yearlyMappedUsers), [yearlyMappedUsers]);
    const weeklyMappedUsers = useMemo(() => mapWeekly(usersAnalytics), [usersAnalytics]);
    const { interval: weeks, intervalUsers: weeklyUsers } = useMemo(() => getMappedUsers(weeklyMappedUsers), [weeklyMappedUsers]);
    const monthlyMappedUsers = useMemo(() => mapMonthly(usersAnalytics), [usersAnalytics]);
    const { interval: months, intervalUsers: monthlyUsers } = useMemo(() => getMappedUsers(monthlyMappedUsers), [monthlyMappedUsers]);

    return (
        <section className='detailed-analytics'>
            <BarGraph title={"Yearly Users"} xAxisValue={years} yAxisValue={yearlyUsers} />
            <BarGraph title={"Weekly Users"} xAxisValue={weeks} yAxisValue={weeklyUsers} />
            <BarGraph title={"Monthly Users"} xAxisValue={months} yAxisValue={monthlyUsers} />
        </section>
    )
}

export default UserDetailedAnalytics