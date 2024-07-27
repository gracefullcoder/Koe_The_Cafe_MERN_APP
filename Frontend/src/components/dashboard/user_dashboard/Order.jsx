import React, { useEffect, useState, useMemo, useRef } from 'react'
import OrderCard from './OrderCard';
import { getData } from "../../../helperfunction.js";
import { io } from "socket.io-client";

function Order() {
    const [ordersDetails, setOrdersDetails] = useState([]);
    const socket = useMemo(() => io(`${import.meta.env.VITE_SERVER_ENDPOINT}`), []);
    const orderIdsRef = useRef([]);

    useEffect(() => {
        const getOrders = async () => {
            let ordersDetails = await getData("order");
            setOrdersDetails(ordersDetails);
        }
        getOrders();

        console.log(socket.id);

        if (ordersDetails.length !== 0) {
            const orderIds = ordersDetails.map(orderdetail => orderdetail._id);
            orderIdsRef.current = orderIds; // update ref with the latest orderIds
            socket.emit("my-orders", orderIds);
        }
    }, [ordersDetails.length])


    useEffect(() => {
        socket.on("updated-status", ({ orderId, status, subOrderId, updatedTime }) => {
            console.log("received updated status");

            if (subOrderId) {
                console.log("in to update suborder", subOrderId);
                setOrdersDetails((prevData) => (
                    prevData.map((ordersDetail) => {

                        const orders = ordersDetail.orders.map((order) => {
                            if (order._id === subOrderId) return { ...order, status: status };
                            else return order;
                        })
                        return { ...ordersDetail, orders };
                    })
                ));
            } else {
                setOrdersDetails((prevData) => (
                    prevData.map((ordersDetail) => {
                        if (ordersDetail._id === orderId) return { ...ordersDetail, status: status, orders: ordersDetail.orders.map(order => ({ ...order, status: status })) };
                        return ordersDetail;
                    })
                ));
            }
        });

        return () => {
            const orderIds = orderIdsRef.current;
            socket.off("connect");
            socket.off("updated-status");
            socket.emit("remove-orders", orderIds, () => {
                console.log("Disconnecting User");
                socket.disconnect();
            });
        };
    }, [socket]);

    console.log(ordersDetails);
    return (
        <section className='dashboard-order'>
            <div className="title"><i className="fa-regular fa-message"></i><span className="text">Orders</span></div>
            <div className='orders'>
                {
                    ordersDetails.map((orderDetail) => (
                        <OrderCard orderDetail={orderDetail} key={orderDetail._id} />
                    ))
                }
            </div>
        </section>
    );
}

export default Order;
