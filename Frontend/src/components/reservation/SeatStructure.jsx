import React, { useMemo, useState, useEffect } from "react";
import { io } from "socket.io-client";
import { toastMessage } from "../../helperfunction.js";
import { toast } from "react-toastify";
import { mappingInside, mappingOutside, setBookings } from "./handleSeats.js";

const insideTableKey = Object.keys(mappingInside);
const outsideTableKeyAbove = Object.keys(mappingOutside.above);
const outsideTableKeyBelow = Object.keys(mappingOutside.below);


function SeatStructure({ selectedSeats, setSelectedSeats, setLoadSeats, userId, reservationData, setReservationData }) {
    console.log("Seat structure is called", reservationData)
    const [seatMatrix, setSeatMatrix] = useState(new Map([]));
    const [totalSeats, setTotalSeats] = useState(selectedSeats.length);

   

    //sockets
    const socket = useMemo(() => (io(`${import.meta.env.VITE_SERVER_ENDPOINT}`)), []);

    const handleDisconnectUser = () => {
        socket.emit("remove-selected-seats", { selectedSeats, userId, slotDetails: { date: reservationData.date, startTime: reservationData.startTime, endTime: reservationData.endTime } });

        setSelectedSeats([]);
        setSeatMatrix(new Map([]));
        socket.off("connect");
        socket.off("seats-layout");
        socket.off("already-booked");
        socket.off("seats-updated");
        socket.off("seat-confirmed");
        console.log("unmounted");
        socket.disconnect();
        setReservationData({
            name: "",
            phone: "",
            startTime: "",
            endTime: "",
            date: "",
            message: ""
        })
        const seatStructureDiv = document.querySelector(".seat-structure");
        const formDiv = document.querySelector(".reservation-form");
        seatStructureDiv.classList.remove("selection");
        formDiv.classList.remove("selection");
        setLoadSeats(false);
    };

    useEffect(() => {
        const seatStructureDiv = document.querySelector(".seat-structure");
        seatStructureDiv.classList.add("selection");
        socket.on("disconnect-user", handleDisconnectUser);

        return () => {
            socket.off("disconnect-user", handleDisconnectUser);
            socket.off("remove-selected-seats");
        };
    }, [selectedSeats]);


    useEffect(() => {
        socket.on("connect", () => {
            console.log("connected with ", socket.id);
            socket.emit("get-reservation", { date: reservationData.date, startTime: reservationData.startTime, endTime: reservationData.endTime, userId });
        });

        socket.on("seats-layout", (seatTracking) => {
            setSeatMatrix(new Map(seatTracking));
            console.log("got from server", seatTracking);
        });

        socket.on("already-booked", (seatKey) => {
            toastMessage({ success: false, message: `Seat Number ${seatKey} is Already Booked Please Selecetd Other Seat` });
        });

        socket.on("already-selected", (seatKey) => {
            toastMessage({ success: false, message: `Seat Number ${seatKey} is Already Selected by Other. If user selects other Seats it will get Free. Please Selecetd Other Seat!` })
        })

        socket.on("seats-updated", ({ seatKey, user, status, slotDetails }) => {
            if (status === "added") {
                console.log(user);
                if (user == userId) {
                    setSelectedSeats((prevData) => {
                        let newBooking = [...prevData, seatKey];
                        return newBooking;
                    });
                    setTotalSeats((prevSeats) => (seatKey.includes(" ") ? prevSeats + 3 : prevSeats + 1));
                    setSeatMatrix((prevSeatMatrix) => {
                        const newSeatMapping = new Map([...prevSeatMatrix]);
                        newSeatMapping.set(seatKey, userId)
                        console.log(newSeatMapping, "inside");
                        return newSeatMapping;
                    });
                }
                else {
                    console.log(setBookings({ date: reservationData.date, startTime: reservationData.startTime, endTime: reservationData.endTime }, slotDetails));
                    if (setBookings({ date: reservationData.date, startTime: reservationData.startTime, endTime: reservationData.endTime }, slotDetails)) {
                        setSeatMatrix((prevSeatMatrix) => {
                            const newSeatMapping = new Map([...prevSeatMatrix]);
                            newSeatMapping.set(seatKey, user)
                            console.log(newSeatMapping, "inside");
                            return newSeatMapping;
                        });
                    }
                }
            }
            else if (status === "disconnected") {
                if (setBookings({ date: reservationData.date, startTime: reservationData.startTime, endTime: reservationData.endTime }, slotDetails)) {
                    setSeatMatrix((prevSeatMatrix) => {
                        const newSeatMapping = new Map([...prevSeatMatrix]);
                        seatKey.forEach((key) => newSeatMapping.delete(key))
                        return newSeatMapping;
                    });
                }
            }
            else {

                if (user == userId) {
                    setSelectedSeats((prevData) => {
                        let newBooking = prevData.filter(seat => seat !== seatKey);
                        return newBooking;
                    });
                    setTotalSeats((prevSeats) => (seatKey.includes(" ") ? prevSeats - 3 : prevSeats - 1));
                    setSeatMatrix((prevSeatMatrix) => {
                        const newSeatMapping = new Map([...prevSeatMatrix]);
                        newSeatMapping.delete(seatKey)
                        return newSeatMapping;
                    });
                }
                else {
                    console.log(setBookings({ date: reservationData.date, startTime: reservationData.startTime, endTime: reservationData.endTime }, slotDetails));
                    if (setBookings({ date: reservationData.date, startTime: reservationData.startTime, endTime: reservationData.endTime }, slotDetails)) {
                        setSeatMatrix((prevSeatMatrix) => {
                            const newSeatMapping = new Map([...prevSeatMatrix]);
                            newSeatMapping.delete(seatKey)
                            return newSeatMapping;
                        });
                    }
                }
            }
        });

        socket.on("seat-confirmed", async ({ selectedSeats, user, slotDetails }) => {
            if (user == userId) {
                setReservationData({
                    name: "",
                    phone: "",
                    startTime: "",
                    endTime: "",
                    date: "",
                    message: ""
                })
                toastMessage({ success: true, message: "Seats are locked !" });
                setSelectedSeats([]);
                setTotalSeats(0);
                setLoadSeats(false);
                let seatStructureDiv = document.querySelector(".seat-structure");
                let formdiv = document.querySelector(".reservation-form");
                seatStructureDiv.classList.remove("selection");
                formdiv.classList.remove("selection");
            } else {
                console.log(setBookings({ date: reservationData.date, startTime: reservationData.startTime, endTime: reservationData.endTime }, slotDetails));
                if (setBookings({ date: reservationData.date, startTime: reservationData.startTime, endTime: reservationData.endTime }, slotDetails)) {
                    setSeatMatrix((prevSeatMatrix) => {
                        const newSeatMapping = new Map([...prevSeatMatrix]);
                        selectedSeats.forEach((seatKey) => {
                            newSeatMapping.set(seatKey, "booked");
                        })
                        return newSeatMapping;
                    });
                }
            }
        });

        return () => {
            socket.off("connect");
            socket.off("seats-layout");
            socket.off("already-booked");
            socket.off("seats-updated");
            socket.off("seat-confirmed");
            console.log("unmounted");
        }

    }, [socket])


    function handleSeatState(table, seatKey) {
        const seatStatus = seatMatrix.get(seatKey);

        if (!seatStatus) {
            return "";
        }
        else if (seatStatus === "booked") {
            return "booked";
        }
        else if (seatStatus == userId) {
            return "selected";
        } else {
            return "preselected";
        }
    }

    function handleSelectedSeats(table, seatKey) {
        console.log(table, seatKey);
        const seatStatus = handleSeatState(table, seatKey);

        if (seatStatus === "") {
            console.log("i sent data to seat-selected event");
            socket.emit("seat-selected", { seatKey, userId, slotDetails: { date: reservationData.date, startTime: reservationData.startTime, endTime: reservationData.endTime } });

        } else if (seatStatus === "selected") {
            console.log("Selected the seat again means removed")
            socket.emit("seat-removed", { seatKey, userId, slotDetails: { date: reservationData.date, startTime: reservationData.startTime, endTime: reservationData.endTime } });
        } else if (seatStatus === "preselected") {
            toastMessage({ success: false, message: "Seat is selected by other.If user not books Table it Will update in 5 minitues or Please Select other seat!" });
        } else {
            toastMessage({ success: false, message: "Seat is already Booked. Please Select other seat!" });
        }
    }

    async function handleReservation(event) {
        event.preventDefault();
        if (!selectedSeats.length) {
            toastMessage({ success: false, message: 'Please Select Table for reservation!' })
        } else {
            // setLoadSeats(prevData => !prevData);
            const reservationUrl = `${import.meta.env.VITE_SERVER_ENDPOINT}`;
            console.log(totalSeats);
            let reserveSeat = await fetch(reservationUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ ...reservationData, seats: selectedSeats, person: totalSeats }),
            });
            let reservationMessage = await reserveSeat.json();
            console.log(reserveSeat);
            if (reserveSeat.ok) {
                toast.success(reservationMessage.message, {
                    position: "top-center",
                    autoClose: 2000,
                });
                socket.emit("seat-booked", { selectedSeats, userId, slotDetails: { date: reservationData.date, startTime: reservationData.startTime, endTime: reservationData.endTime } });

            } else {
                toast.error(reservationMessage.message, {
                    position: "top-center",
                    autoClose: 6000,
                });
                let seatStructureDiv = document.querySelector(".seat-structure");
                let formdiv = document.querySelector(".reservation-form");
                seatStructureDiv.classList.remove("selection");
                formdiv.classList.remove("selection");
                setLoadSeats(false);
            }
        }
    }

    return (
        <div className="seat-structure">
            <h1 className="label-2 section-subtitle text-center">Select your seat</h1>
            <div className="seating-area ">
                <div className="inside">
                    <p className="area-heading text-center">Inside Area</p>
                    <div className="seat-matrix-inside">
                        {insideTableKey.map((table, index) => (
                            index % 2 == 0 ? (
                                <div className={`table table-${index + 1}`} key={table}>
                                    <div className="dinning-table table-circle" >{`Table ${index + 1}`}
                                        <span>
                                            {mappingInside[table].length} <i className="fa-solid fa-user"></i>
                                        </span>
                                    </div>
                                    {mappingInside[table].map((seatKey, idx) => (
                                        <div className={`seat-${idx + 1} normal-seat text ${handleSeatState(table, seatKey)}`} key={seatKey} onClick={(event) => handleSelectedSeats(table, seatKey)}>{seatKey}</div>
                                    ))}
                                </div>
                            ) : (
                                <div className={`table table-${index + 1}`} key={table}>
                                    <div className="dinning-table table-rectangle" >{`Table ${index + 1}`}
                                        <span>
                                            {mappingInside[table].length} <i className="fa-solid fa-user"></i>
                                        </span>
                                    </div>
                                    {mappingInside[table].map((seatKey, idx) => (
                                        seatKey.length == 2 ?
                                            (<div className={`seat-${idx + 1} normal-seat ${handleSeatState(table, seatKey)}`} key={seatKey} onClick={(event) => handleSelectedSeats(table, seatKey)}>{seatKey}</div>) :
                                            (<div className={`seat-${idx + 1} sofa-seat ${handleSeatState(table, seatKey)}`} key={seatKey} onClick={(event) => handleSelectedSeats(table, seatKey)}>{seatKey}</div>)
                                    ))}
                                </div>
                            )
                        ))}
                    </div>
                    <div className="booking-status" >
                        <div type="text" className="input-field selected-seats"> {selectedSeats.join(' , ')}</div>
                        <div className="seats-data">
                            <button className="btn btn-primary" onClick={handleReservation}>
                                <span className="text text-1">Book Selected Seats!</span>
                                <span className="text text-2">Let's Go</span>
                            </button>

                            <div className="icon-wrapper">
                                <ion-icon name="person-outline" aria-hidden="true"></ion-icon>
                                <input
                                    type="number"
                                    name="person"
                                    id="person"
                                    placeholder=""
                                    min="1"
                                    max="200"
                                    className="input-field"
                                    value={totalSeats}
                                    required
                                    disabled
                                />

                            </div>


                        </div>
                        <button className="text-center cancel-btn" onClick={handleDisconnectUser}>Cancel Booking</button>
                    </div>
                </div>


                <div className="outside">
                    <p className="area-heading text-center">Outside Area</p>
                    <div className="seat-matrix-outside">
                        <div className="above-stairs">
                            {
                                outsideTableKeyAbove.map((table, index) => (
                                    index < 3 ? (
                                        <div className={`table table-${index + 1}`} key={table}>
                                            <div className="dinning-table table-square">{`Table ${index + 7}`}
                                                <span>{mappingOutside.above[table].length} <i className="fa-solid fa-user"></i></span>
                                            </div>
                                            {mappingOutside.above[table].map((seatKey, idx) => (
                                                (<div className={`seat-${idx + 1} normal-seat ${handleSeatState(table, seatKey)}`} key={seatKey} onClick={(event) => handleSelectedSeats(table, seatKey)}>{seatKey}</div>)
                                            ))}
                                        </div>
                                    ) : (
                                        <div className={`table table-${index + 1}`} key={table}>
                                            <div className="dinning-table table-square">{`Table ${index + 7}`}
                                                <span>{mappingOutside.above[table].length} <i className="fa-solid fa-user"></i></span>
                                            </div>
                                            {mappingOutside.above[table].map((seatKey, idx) => (
                                                (<div className={`seat-${idx + 1} normal-seat ${handleSeatState(table, seatKey)}`} key={seatKey} onClick={(event) => handleSelectedSeats(table, seatKey)}>{seatKey}</div>)
                                            ))}
                                        </div>
                                    )
                                ))
                            }

                        </div>

                        <div className="below-stairs">
                            {outsideTableKeyBelow.map((table, index) => (
                                <div className={`table table-${index + 10}`} key={table}>
                                    <div className="dinning-table table-rectangle">
                                        {`Table ${index + 15}`}
                                        <span>{mappingOutside.below[table].length} <i className="fa-solid fa-user"></i></span>
                                    </div>
                                    {mappingOutside.below[table].map((seatKey, idx) => (
                                        seatKey.includes(" ") ? (
                                            <div className={`sofa-seat ${handleSeatState(table, seatKey)}`} key={seatKey} onClick={(event) => handleSelectedSeats(table, seatKey)}>{seatKey}</div>
                                        ) : (
                                            <div className={`seat-${idx + 1} normal-seat ${handleSeatState(table, seatKey)}`} key={seatKey} onClick={(event) => handleSelectedSeats(table, seatKey)}>
                                                {seatKey}
                                            </div>
                                        )
                                    ))}
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default SeatStructure;
