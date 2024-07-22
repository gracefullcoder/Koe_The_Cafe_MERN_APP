import React, { useEffect, useState, useMemo } from 'react'
import OrderTable from './OrderTable'
import { getData } from "../../../helperfunction";
import { io } from "socket.io-client";
import {Filter} from "../../Filter/Filter";
function ManageOrder() {
    const [ordersDetails, setOrdersDetails] = useState([]);
    const socket = useMemo(() => (io(`${import.meta.env.VITE_SERVER_ENDPOINT}`)), []);
    const [filter, setFilter] = useState("Live");

    useEffect(() => {
        socket.on("connect", () => {
            console.log(socket.id);
        })

        socket.on("new-order", (order) => {
            setOrdersDetails(prev => [order, ...prev])
        })
    }, [socket])

    useEffect(() => {
        const getOrderData = async () => {
            const ordersDetail = await getData("order/manage");
            setOrdersDetails(ordersDetail);
            console.log(ordersDetail);
        }

        getOrderData();
    }, [])

    return (
        <section>
            <div className="title"><i className="uil uil-tachometer-fast-alt"></i><span className="text">Manage Orders</span></div>
            <Filter filter={{ options: ["All", "Live"], select: filter }} setState={setFilter}></Filter>
            {
                filter == "Live" ?
                    (
                        ordersDetails.filter(order => order.status != "Served").map((ordersDetail) => (
                            <OrderTable ordersDetail={ordersDetail} setOrdersDetails={setOrdersDetails} socket={socket} key={ordersDetail._id} />
                        ))
                    )
                    :
                    (
                        ordersDetails.map((ordersDetail) => (
                            <OrderTable ordersDetail={ordersDetail} socket={socket} key={ordersDetail._id} setOrdersDetails={setOrdersDetails} />
                        ))

                    )
            }
        </section >
    )
}

export default ManageOrder