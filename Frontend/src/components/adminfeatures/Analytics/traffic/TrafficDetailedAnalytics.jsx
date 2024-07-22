import React, { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { DateFilter, MultipleFilter } from "../../../Filter/Filter";
import { PrimaryButton } from '../../../reuseable/Button';
import MailNotification from '../../Notification/MailNotification';
import { dataInDateRange } from '../AnalyticsFunctions';

function generateTrafficReport(trafficAnalytics) {
    const menuLookup = {};
    const dishAdded = {};
    const linksVisited = {};
    const actions = {};
    const pageVisited = {};

    trafficAnalytics.forEach((traffic) => {
        if (traffic.menuLookup) {
            menuLookup[traffic.menuLookup] ? menuLookup[traffic.menuLookup].push(traffic) : menuLookup[traffic.menuLookup] = [traffic];
        } else if (traffic.dishAdded) {
            dishAdded[traffic.dishAdded.dishName] ? dishAdded[traffic.dishAdded.dishName].push(traffic) : dishAdded[traffic.dishAdded.dishName] = [traffic];
        } else if (traffic.LinkVisited) {
            linksVisited[traffic.LinkVisited] ? linksVisited[traffic.LinkVisited].push(traffic) : linksVisited[traffic.LinkVisited] = [traffic];
        } else if (traffic.action) {
            actions[traffic.action.key] ? actions[traffic.action.key].push(traffic) : actions[traffic.action.key] = [traffic];
        } else {
            pageVisited[traffic.pageVisited] ? pageVisited[traffic.pageVisited].push(traffic) : pageVisited[traffic.pageVisited] = [traffic];
        }
    });
    return { menuLookup, dishAdded, linksVisited, actions, pageVisited };
}

function TrafficDetailedAnalytics() {
    const { trafficAnalytics, setAnalytics } = useOutletContext();
    const [filteredTraffic, setFilteredTraffic] = useState({});
    const [trafficFilter, setTrafficFilter] = useState({ pageFilter: "", linkFilter: "", dishFilter: "", menuFilter: "" });
    const [mailUsers, setMailUsers] = useState([]);
    const [dateFilter, setDateFilter] = useState({ startDate: "", endDate: "" });

    useEffect(() => {
        const generatedTraffic = generateTrafficReport(trafficAnalytics);
        setFilteredTraffic(generatedTraffic);
        setTrafficFilter({
            pageFilter: Object.keys(generatedTraffic.pageVisited)[0] || "",
            linkFilter: Object.keys(generatedTraffic.linksVisited)[0] || "",
            dishFilter: Object.keys(generatedTraffic.dishAdded)[0] || "",
            menuFilter: Object.keys(generatedTraffic.menuLookup)[0] || ""
        });
    }, [trafficAnalytics]);

    const applyDateFilter = () => {
        const filteredData = dataInDateRange(trafficAnalytics, dateFilter.startDate, dateFilter.endDate);
        const generatedTraffic = generateTrafficReport(filteredData);
        setFilteredTraffic(generatedTraffic);
        setTrafficFilter({
            pageFilter: Object.keys(generatedTraffic.pageVisited)[0] || "",
            linkFilter: Object.keys(generatedTraffic.linksVisited)[0] || "",
            dishFilter: Object.keys(generatedTraffic.dishAdded)[0] || "",
            menuFilter: Object.keys(generatedTraffic.menuLookup)[0] || ""
        });
    };

    const addMailUsers = (data) => {
        const users = [];
        data.forEach((user) => {
            let userMail = user.userName;
            if (!users.includes(userMail)) users.push(userMail);
        });
        setMailUsers(users);
    };

    const addAllMailUsers = (mappedData) => {
        const users = [];
        Object.keys(mappedData).forEach(key => {
            mappedData[key].forEach(data => {
                let user = data.userName;
                if (!users.includes(user) && user !== 'anonymous') users.push(user);
            });
        });
        setMailUsers(users);
    };

    const { menuLookup, dishAdded, linksVisited, actions, pageVisited } = filteredTraffic;

    return (
        <>
            <DateFilter filter={[dateFilter, setDateFilter]} filterFnx={applyDateFilter} />
            <div className='traffic-container text-center'>
                <div className='analytics-container'>
                    <p className='analytics-title'>Users Added Dish in Cart!</p>
                    <MultipleFilter filter={{ options: Object.keys(dishAdded || {}), name: 'dishFilter' }} setState={setTrafficFilter} />
                    <div className="mail-btns">
                        <PrimaryButton text1={`Mail Filtered Users`} text2={"Mail Filtered User"} fnx={() => addMailUsers(dishAdded[trafficFilter.dishFilter])} />
                        <PrimaryButton text1={"Mail All Users"} fnx={() => addAllMailUsers(dishAdded)} />
                    </div>
                    <div className="analytics-data">
                        {trafficFilter.dishFilter && dishAdded[trafficFilter.dishFilter] && dishAdded[trafficFilter.dishFilter].map((detail, idx) => (
                            <div key={idx}>
                                <p>Username : {detail.userName}</p>
                                <p>DishName : {detail.dishAdded.dishName}</p>
                                <p>DishId : {detail.dishAdded.dishId}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='analytics-container'>
                    <p className='analytics-title'>Users who Looked Up Menu!</p>
                    <MultipleFilter filter={{ options: Object.keys(menuLookup || {}), name: 'menuFilter' }} setState={setTrafficFilter} />
                    <div className="mail-btns">
                        <PrimaryButton text1={`Mail Filtered Users`} text2={"Mail Filtered User"} fnx={() => addMailUsers(menuLookup[trafficFilter.menuFilter])} />
                        <PrimaryButton text1={"Mail All Users"} fnx={() => addAllMailUsers(menuLookup)} />
                    </div>
                    <div className="analytics-data">
                        {trafficFilter.menuFilter && menuLookup[trafficFilter.menuFilter] && menuLookup[trafficFilter.menuFilter].map((detail, idx) => (
                            <div key={idx}>
                                <p>Username : {detail.userName}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='analytics-container'>
                    <p className='analytics-title'>Have a Look what links user are exploring!</p>
                    <MultipleFilter filter={{ options: Object.keys(linksVisited || {}), name: 'linkFilter' }} setState={setTrafficFilter} />
                    <div className="mail-btns">
                        <PrimaryButton text1={`Mail Filtered Users`} text2={"Mail Filtered User"} fnx={() => addMailUsers(linksVisited[trafficFilter.linkFilter])} />
                        <PrimaryButton text1={"Mail All Users"} fnx={() => addAllMailUsers(linksVisited)} />
                    </div>
                    <div className="analytics-data">
                        {trafficFilter.linkFilter && linksVisited[trafficFilter.linkFilter] && linksVisited[trafficFilter.linkFilter].map((detail, idx) => (
                            <div key={idx}>
                                <p>Username : {detail.userName}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='analytics-container'>
                    <p className='analytics-title'>Track what actions users are performing!</p>
                    <div className="analytics-data">
                        {actions && Object.keys(actions).map((data, index) => (
                            <div key={index}>
                                <p className='analytics-title'>{data}</p>
                                {actions[data].map((detail, idx) => (
                                    <div key={idx}>
                                        <p>Username : {detail.userName}</p>
                                        <p>Action : {detail.action.description}</p>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                <div className='analytics-container'>
                    <p className='analytics-title'>Track which pages users are exploring!</p>
                    <MultipleFilter filter={{ options: Object.keys(pageVisited || {}), name: 'pageFilter' }} setState={setTrafficFilter} />
                    <div className="mail-btns">
                        <PrimaryButton text1={`Mail Filtered Users`} text2={"Mail Filtered User"} fnx={() => addMailUsers(pageVisited[trafficFilter.pageFilter])} />
                        <PrimaryButton text1={"Mail All Users"} fnx={() => addAllMailUsers(pageVisited)} />
                    </div>
                    <div className="analytics-data">
                        {trafficFilter.pageFilter && pageVisited[trafficFilter.pageFilter] && pageVisited[trafficFilter.pageFilter].map((detail, idx) => (
                            <div key={idx}>
                                <p>Username : {detail.userName}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div style={{ width: "100%" }} id='#mail-traffic'>
                    <MailNotification users={mailUsers} />
                </div>
            </div>
        </>
    );
}

export default TrafficDetailedAnalytics;
