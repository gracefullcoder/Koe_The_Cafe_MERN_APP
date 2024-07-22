import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { toastMessage } from '../../../helperfunction';

const isDateSame = (date1, date2) => {
    if ((date1.getDate() == date2.getDate()) && (date1.getMonth() == date2.getMonth()) && (date1.getFullYear() == date2.getFullYear())) return true;
    return false;
}

const recentData = (completeData) => {
    let todayData = [];
    let yesterdayData = [];
    let dayBefYestData = [];

    const currentDate = new Date();
    const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
    const dayBeforeYesterday = new Date(new Date().setDate(new Date().getDate() - 2));
    let dataDate;

    for (let i = completeData.length - 1; i >= 0; i--) {
        dataDate = new Date(completeData[i].createdAt);
        if (isDateSame(currentDate, dataDate)) {
            todayData.push(completeData[i]);
        } else if (isDateSame(yesterday, dataDate)) {
            yesterdayData.push(completeData[i]);
        } else if (isDateSame(dayBeforeYesterday, dataDate)) {
            dayBefYestData.push(completeData[i]);
        } else {
            break;
        }
    }

    return { todayData, yesterdayData, dayBefYestData };
}

const getWeekData = (weeklyMappedData) => {
    const currentTime = new Date();
    let currentDate = currentTime.getDate();

    if (currentDate >= 22) {
        currentDate = '22'
    } else if (currentDate >= 15) {
        currentDate = '15'
    } else if (currentDate >= 8) {
        currentDate = '08';
    } else {
        currentDate = '01';
    }

    const key = `${currentDate}-${currentTime.getMonth() + 1}-${currentTime.getFullYear()}`;
    return weeklyMappedData.get(key) || [];
}

const mapWeekly = (completeData) => {
    let weeklyMap = new Map();

    completeData.forEach((data) => {
        let createdAt = new Date(data.createdAt);
        let createdDate = createdAt.getDate();

        if (createdDate >= 22) {
            createdDate = '22'
        } else if (createdDate >= 15) {
            createdDate = '15'
        } else if (createdDate >= 8) {
            createdDate = '08';
        } else {
            createdDate = '01';
        }

        let key = `${createdDate}-${createdAt.getMonth() + 1}-${createdAt.getFullYear()}`;
        let weekData = weeklyMap.get(key);

        if (weekData) {
            weekData.push(data);
        } else {
            weeklyMap.set(key, [data]);
        }
    });

    return weeklyMap;
}

const getMonthName = (month) => {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"]
    return `${monthNames[month - 1]}`;
}

const mapMonthly = (completeData) => {
    let monthlyMapped = new Map();
    let dataDate;
    completeData.forEach((data) => {

        dataDate = new Date(data.createdAt);
        let key = `${dataDate.getMonth() + 1}-${dataDate.getFullYear()}`;
        let monthData = monthlyMapped.get(key);

        if (monthData) {
            monthData.push(data);
        } else {
            monthlyMapped.set(key, [data]);
        }
    });

    return monthlyMapped;
}

const monthData = (monthyMapping) => {
    let currentDate = new Date();
    return monthyMapping.get(`${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`) || [];
}

const mapYearly = (completeData) => {
    let yearlyMapped = new Map();

    completeData.forEach((data) => {
        let date = new Date(data.createdAt);
        let key = `${date.getFullYear()}`;
        let yearData = yearlyMapped.get(key);

        if (yearData) {
            yearData.push(data);
        } else {
            yearlyMapped.set(key, [data]);
        }
    });

    return yearlyMapped;
}

const providePastDate = (interval, currentDate = new Date()) => {
    let pastDate = new Date().setDate(currentDate.getDate() - interval);
    return pastDate;
}


const getAxisKeys = (data) => {
    return [...data.entries()];
}


const axisConfig = (axisColor = '#ffffff', tickColor = '#ffffff') => ({
    [`.${axisClasses.root}`]: {
        [`.${axisClasses.tick}, .${axisClasses.line}`]: {
            stroke: axisColor,
            strokeWidth: 3,
        },
        [`.${axisClasses.tickLabel}`]: {
            fill: tickColor,
        },
    },
})


const dataInDateRange = (data, startDate, endDate) => {
    const rangedData = [];
    if (!startDate || !endDate) toastMessage({ success: false, message: "Please select valid date range to filter data" });
    else {
        startDate = new Date(startDate);
        endDate = new Date(endDate);

        data.forEach((doc) => {
            let createdDate = new Date(doc.createdAt)
            console.log(createdDate, startDate, endDate, ((createdDate >= startDate) && (createdDate <= endDate)));
            if (((createdDate >= startDate) && (createdDate <= endDate))) rangedData.push(doc);
        })
        return rangedData;
    }

    return false;

}



export { mapMonthly, getAxisKeys, axisConfig, mapYearly, mapWeekly, recentData, monthData, getMonthName, getWeekData, dataInDateRange };