import React, { useState } from 'react';
import koeLogo from "../../../assets/images/koe-logo.png";
import clipboard from "../../../assets/images/icons/clipboard.png";
import preparation from "../../../assets/images/icons/preparation.png"
import prepared from "../../../assets/images/icons/prepared.png"
import served from "../../../assets/images/icons/served.png";
import cancelled from "../../../assets/images/icons/cancelled.png"
import { getTime12hrs } from '../../../helperfunction';
import RatingCard from "./RatingCard";

function OrderCard({ orderDetail }) {

    let [view, setView] = useState(false);

    const toggleView = (select) => {
        setView(prev => (select === "rating" ? select : !prev));
    }

    const setStatus = (currentStatus, position) => {
        if (currentStatus == "Cancelled") return "deactivate";
        if (position == 1) {
            return currentStatus == "Ordered" ? "active" : "deactivate"
        }
        else if (position == 2) {
            return currentStatus == "Preparing" ? "active" : currentStatus == "Ordered" ? "" : "deactivate";
        }
        else if (position == 3) {
            return currentStatus == "Prepared" ? "active" : currentStatus == "Served" ? "deactivate" : "";
        } else {
            return currentStatus == "Served" && "active";
        }
    }

    return (
        <>
            {
                view === "rating" ?

                    <RatingCard orderDetail= {orderDetail} onCancel={setView}/>

                    :

                    view ?
                        (<div className="menu-container detailed-order">
                            {orderDetail.orders.map((order, index) => (
                                <div className="dish-box" key={order._id}>
                                    <div className='dish'>
                                        <img src={order.dish.dishImage} alt="dish" className='dish-logo' />
                                        <div className='dish-details'>
                                            <div className='dish-title'>
                                                <span className="title-3">{order.dish.dishName}</span>
                                                <span className='dish-badge'>{order.dish.tag}</span>
                                                <span className='dish-price title-3'>
                                                    Price: {order.dish.price}/-
                                                </span>
                                            </div>
                                            <div className='dish-description card-text label-1'>
                                                {order.dish.description}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="order-options">
                                        <div className='qty-icons' >
                                            {/* <i className="fa-solid fa-minus" onClick={() => { order.quantity != 0 && order.quantity == 1 ? removeFromCart(order.dish._id, setCart) : decreaseQty(order.dish._id, setCart); }}></i> */}
                                            <span className='qty title-3'>Qty : {order.quantity}</span>
                                            {/* <i className="fa-solid fa-plus" onClick={() => { increaseQty(order.dish._id, setCart) }}></i> */}
                                        </div>
                                        <div>

                                        </div>
                                        <p>Total: {order.quantity * order.dish.price} </p>
                                    </div>
                                    <div className='order-timeline'>
                                        <div className={`timeline-status ${setStatus(order.status, 1)}`}>
                                            <span>
                                                <img src={clipboard} ></img>
                                            </span>
                                            <div>
                                                <div className="status-dot" ></div>
                                                <div className="status-line"></div>
                                            </div>

                                            <span>Order Placed</span>
                                            <span className='status-time-created'>{getTime12hrs(orderDetail.createdAt)}</span>
                                        </div>
                                        <div className={`timeline-status ${setStatus(order.status, 2)}`}>
                                            <span>
                                                <img src={preparation} ></img>
                                            </span>
                                            <div>
                                                <div className='status-dot'></div>
                                                <div className='status-line'></div>
                                            </div>

                                            <span>Preparing</span>
                                            <span className='status-time'>{getTime12hrs(orderDetail.updatedAt)}</span>
                                        </div>
                                        <div className={`timeline-status ${setStatus(order.status, 3)}`}>
                                            <span><img src={prepared} ></img></span>
                                            <div>
                                                <div className='status-dot'></div>
                                                <div className='status-line'></div>
                                            </div>

                                            <span>Prepared</span>
                                            <span className='status-time'>{getTime12hrs(orderDetail.updatedAt)}</span>
                                        </div>
                                        <div className={`timeline-status ${setStatus(order.status, 4)}`}>
                                            <span><img src={served} ></img></span>
                                            <div>
                                                <div className='status-dot'></div>
                                            </div>

                                            <span>Served</span>
                                            <span className='status-time'>{getTime12hrs(orderDetail.updatedAt)}</span>
                                        </div>
                                        {order.status == "Cancelled" &&
                                            <div className={`timeline-status active`}>
                                                <span><img src={cancelled} ></img></span>
                                                <div>
                                                    <div className='status-dot'></div>
                                                </div>

                                                <span>Cancelled</span>
                                                <span className='status-time'>{getTime12hrs(orderDetail.updatedAt)}</span>
                                            </div>}
                                    </div>
                                </div>
                            ))}
                            <hr />
                            <div className='accounting'>
                                <button onClick={() => toggleView("rating")}>Rate Order</button>
                                <span className='total'>
                                    <pre>
                                        Sub-Total :
                                    </pre>
                                    {orderDetail.totalAmount}/-
                                </span>

                                <button onClick={toggleView}>
                                    Close Order
                                </button>
                            </div>

                        </div>)

                        :
                        (<div className='order-card'>
                            <div className='order-basics card-top'>
                                <div className='order-id'>
                                    <img src={koeLogo} alt="logo" className='logo' />
                                    <div>
                                        <h5 className='order-id'>{orderDetail._id}</h5>
                                        <p className='label-1'>Total items : {orderDetail.orders.reduce((acc, order) => (acc + order.quantity), 0)}</p>
                                    </div>
                                </div>
                                <div className='order-status'>
                                    <span>{orderDetail.status} </span>
                                    <i className="fa-solid fa-check"></i>
                                </div>
                            </div>
                            <div className='card-bottom'>
                                <div className='order-basics'>
                                    <p>{orderDetail.createdAt.toString().slice(0, 10).concat(" ", getTime12hrs(orderDetail.createdAt))}</p>
                                    <h4>{orderDetail.totalAmount}/-</h4>
                                </div>
                                <div className='order-basics'>
                                    <p>Order-Type</p>
                                    <h4>Dine-In</h4>
                                </div>
                                <div className='order-basics order-btns'>
                                    <button className='ordercard-btn' onClick={toggleView}>View Order</button>
                                    <button className='ordercard-btn' onClick={() => toggleView("rating")}>Rate Order</button>
                                </div>
                            </div>
                        </div>)
            }
        </>





    )
}

export default OrderCard