const mappingInside = {
    table1: ["A1", "A2", "A3"],
    table2: ["B1", "B2", "B3", "B4 B5 B6"],
    table3: ["C1", "C2", "C3"],
    table4: ["D1", "D2", "D3", "D4 D5 D6"],
    table5: ["E1", "E2", "E3"],
    table6: ["F1", "F2", "F3", "F4 F5 F6"],
};

const mappingOutside = {
    above: {
        table7: ['G1', 'G2'],
        table8: ['H1', 'H2'],
        table9: ['I1', 'I2'],
        table10: ['J1', 'J2', 'J3', 'J4'],
        table11: ['K1', 'K2', 'K3', 'K4'],
        table12: ['L1', 'L2', 'L3', 'L4'],
        table13: ['M1', 'M2', 'M3', 'M4'],
        // spaceEmpty: [],
        table14: ['N1', 'N2', 'N3', 'N4'],
    },
    below: {
        table15: ["O1", "O2", "O3", "O4 O5 O6"],
        table16: ["P1", "P2", "P3", "P4 P5 P6"]
    }
};


const parseTime = (time) => {
    return { hrs: parseInt(time.slice(0, 2)), minutes: parseInt(time.slice(3, 5)) };
}

const timeInterval = (userTime, bookedTime) => {
    if (userTime.hrs != bookedTime.hrs) return (userTime.hrs > bookedTime.hrs ? true : false);
    return (userTime.minutes >= bookedTime.minutes ? true : false);
}

function setBookings(userSlotDetails, updatedSlotDetails) {

    if (userSlotDetails.date != updatedSlotDetails.date) return false;

    const userStartTime = parseTime(userSlotDetails.startTime);
    const userEndTime = parseTime(userSlotDetails.endTime);
    const updatedStartTime = parseTime(updatedSlotDetails.startTime);
    const updatedEndTime = parseTime(updatedSlotDetails.endTime);

    if (timeInterval(userStartTime, updatedStartTime) && timeInterval(userStartTime, updatedEndTime)) {
        return false;
    }

    if (timeInterval(updatedStartTime, userStartTime) && timeInterval(updatedStartTime, userEndTime)) {
        console.log("i m in");
        return false;
    }

    return true;
}

export { mappingInside, mappingOutside, setBookings };
