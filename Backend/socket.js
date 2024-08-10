const Booking = require('./models/booking.js');

async function setOverlappingBookings(slotDetails) {
    const parseTime = (time) => {
        return { hrs: parseInt(time.slice(0, 2)), minutes: parseInt(time.slice(3, 5)) };
    }

    const userStartTime = parseTime(slotDetails.startTime);
    const userEndTime = parseTime(slotDetails.endTime);

    let bookings = await Booking.find({ date: slotDetails.date });

    const timeInterval = (userTime, bookedTime) => {
        if (userTime.hrs != bookedTime.hrs) return (userTime.hrs > bookedTime.hrs ? true : false);
        return (userTime.minutes >= bookedTime.minutes ? true : false);
    }

    console.log(bookings, slotDetails);

    const bookedSeats = bookings.map((booking) => {

        const bookedStartTime = parseTime(booking.startTime);
        const bookedEndTime = parseTime(booking.endTime);


        if (!(timeInterval(userStartTime, bookedStartTime) && timeInterval(userStartTime, bookedEndTime))) {
            return booking;
        }

        if (!(timeInterval(bookedStartTime, userStartTime) && timeInterval(bookedStartTime, userEndTime))) {
            return booking;
        }

    })
    console.log(bookedSeats);

    const newSeatMapping = new Map();
    bookedSeats.forEach((booking) => {
        booking.seats.forEach((seat) => {
            newSeatMapping.set(seat, "booked");
        })
    })
    console.log("i m the new", newSeatMapping);
    return newSeatMapping;
}

const socketConnections = (io) => {
    const orderIdToSocket = new Map();
    const seatTracking = new Map();

    io.on("connection", (socket) => {
        let timeOver = null;

        socket.on("get-reservation", async (slotDetails) => {
            const seatMapping = await setOverlappingBookings(slotDetails);
            socket.emit("seats-layout", [...seatMapping]);
            console.log("recieved client send matrix");
            timeOver = setTimeout(() => {
                socket.emit("disconnect-user")
            }, 100000);
        })

        socket.on("remove-selected-seats", ({ selectedSeats, userId, slotDetails }) => {
            console.log("here", selectedSeats);
            socket.broadcast.emit("seats-updated", { seatKey: selectedSeats, userId, slotDetails, status: "disconnected" })
        })

        socket.on("seat-selected", ({ seatKey, userId, slotDetails }) => {
            console.log("seatselected", seatKey);

            io.emit("seats-updated", { seatKey, status: "added", user: userId, slotDetails });
        })

        socket.on("seat-removed", ({ seatKey, userId, slotDetails }) => {
            io.emit("seats-updated", { seatKey, status: "removed", user: userId, slotDetails });
        })

        socket.on("seat-booked", async ({ selectedSeats, userId, slotDetails }) => {
            const bookingData = {};

            selectedSeats.forEach((seat) => {
                seatTracking.set(seat, "booked");
                const table = "table".concat(seat[0].charCodeAt(0) - 64);
                bookingData[`${table}.${seat}`] = userId;
            })
            console.log(bookingData);
            clearTimeout(timeOver);
            io.emit("seat-confirmed", { selectedSeats, user: userId, slotDetails });
        })

        socket.on("my-orders", (orderIds) => {
            const socketId = socket.id;
            orderIds.forEach((id) => orderIdToSocket.set(id, socketId));
            console.log(orderIdToSocket);
        })

        socket.on("order-updated", (data) => {
            console.log("order updated",data);
            const socketId = orderIdToSocket.get(data.orderId);
            io.to(socketId).emit("updated-status", data);
        })

        socket.on("remove-orders", (orderIds, callback) => {
            orderIds.forEach(orderId => {
                orderIdToSocket.delete(orderId);
            })
            console.log(orderIds, " remove then => upadted socket to orderid map map ", orderIdToSocket);
            callback();
        })

        socket.on("disconnect", () => {
            console.log("User with socket ", socket.id, " got disconected")
        })
    })
}


module.exports = socketConnections;