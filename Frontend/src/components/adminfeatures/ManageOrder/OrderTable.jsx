import TableHead from "../MenuSection/TableHead";
import { patchData } from "../../../helperfunction";
import { useState } from "react";

function OrderTable({ ordersDetail, socket, setOrdersDetails }) {
    let [orderStatus, setOrderStatus] = useState(ordersDetail.status);
    let [subOrderStatus, setSubOrderStatus] = useState(
        ordersDetail.orders.map((order) => order.status)
    );

    const updateStatus = async (event, orderId) => {
        const status = event.target.value;
        const updatedData = await patchData("order/manage", { orderId, status });
        if (updatedData.success == true) {
            socket.emit("order-updated", { orderId, status });
            setOrderStatus(status);
            setSubOrderStatus((prev) => prev.map(() => status));
            if (status == "Served") {
                setOrdersDetails((prevOrders) => (
                    prevOrders.map((order) => (
                        order._id == orderId ? { ...order, status: status } : order
                    ))
                ));
            }
        }
    };

    const updateDishStatus = async (event, orderId, subOrderId, index) => {
        const status = event.target.value;
        const updatedData = await patchData("order/manage", {
            orderId,
            status,
            subOrderId,
        });
        if (updatedData.success == true) {
            socket.emit("order-updated", {
                orderId,
                status,
                subOrderId,
                updatedTime: updatedData.updatedTime,
            });
            setSubOrderStatus((prev) => {
                const newSubOrder = [...prev];
                newSubOrder[index] = status;
                return newSubOrder;
            });
        }
    };

    return (
        <div className="table-container">
            <table className="details-table">
                <TableHead
                    tableHead={["Orders", "Order Status", "Update status", "Customer"]}
                />
                <tbody>
                    <tr>
                        <td colSpan="2">Order Id: {ordersDetail._id}</td>
                        <td rowSpan={`${ordersDetail.orders.length + 1}`}>
                            <select
                                className="input-field"
                                name="order-status"
                                value={orderStatus}
                                id="order-status"
                                onChange={(event) => updateStatus(event, ordersDetail._id)}
                            >
                                <option value="Ordered">Ordered</option>
                                <option value="Preparing">Preparing</option>
                                <option value="Prepared">Prepared</option>
                                <option value="Served">Served</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </td>
                        <td rowSpan={`${ordersDetail.orders.length + 1}`}>
                            {ordersDetail.user.fullname}
                        </td>
                    </tr>
                    {ordersDetail.orders.map((order, index) => (
                        <tr key={order._id}>
                            <td>
                                <span>{order.dish.dishName}</span>
                                <span>{order.quantity} Pcs</span>
                            </td>
                            <td>
                                <select
                                    name="order-status"
                                    id="order-status"
                                    value={subOrderStatus[index]}
                                    className="input-field"
                                    onChange={(event) =>
                                        updateDishStatus(event, ordersDetail._id, order._id, index)
                                    }
                                >
                                    <option value="Ordered">Ordered</option>
                                    <option value="Preparing">Preparing</option>
                                    <option value="Prepared">Prepared</option>
                                    <option value="Served">Served</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default OrderTable;
