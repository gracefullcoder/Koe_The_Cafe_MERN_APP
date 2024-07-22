const express = require("express");
const { wrapAsync } = require("../utils/wrapAsyncAndExpressError");
const Order = require("../models/order");
const User = require("../models/user");
const router = express.Router();
const { isAdmin } = require("../middlewares/adminmiddlewares");
const Dish = require("../models/dish");

router.route("/manage", isAdmin)
    .get(wrapAsync(async (req, res) => {
        const Orders = await Order.find().populate({ path: 'user', select: { fullname: 1, _id: 1 } }).sort({ createdAt: -1 });
        res.status(200).json(Orders);
    }))

    .patch(wrapAsync(async (req, res) => {
        let { orderId, status, subOrderId } = req.body;
        let order;
        if (subOrderId) {
            order = await Order.findOneAndUpdate({ _id: orderId, 'orders._id': subOrderId }, { $set: { 'orders.$.status': status } })
        }
        else { order = await Order.findOneAndUpdate({ _id: orderId }, { status: status, 'orders.$[].status': status }) }
        res.status(200).json({ success: true, message: "Order Updated Successfully!", updatedTime: order.updatedAt });
    }))



router.route("/")
    .get(wrapAsync(async (req, res) => {
        const userId = req.user._id;
        const orderDetails = await User.findById(userId, 'orders').populate({
            path: 'orders',
            options: { sort: { createdAt: -1 } }
        });
        // console.log(orderDetails);
        res.status(200).json(orderDetails.orders);
    }))

    .post(wrapAsync(async (req, res) => {
        const { orderDetails } = req.body;

        let totalAmount = orderDetails.reduce((acc, order) => { return acc + (order.dish.price * order.quantity) }, 0);
        const userId = req.user;
        const newOrder = new Order({ orders: orderDetails, totalAmount: totalAmount, user: userId });
        const order = await newOrder.save();
        await User.findByIdAndUpdate(userId, { $push: { 'orders': order._id }, cart: [] });
        let io = req.app.get('socket.io');
        io.emit("new-order", order);
        res.status(200).json({ success: true, message: "Order Placed Successfully!" });
    }));

router.patch("/rating/:id", wrapAsync(async (req, res) => {
    console.log(req.body);
    const { overallRating, overallComment, dishReviews } = req.body;
    const { id } = req.params;
    const orderDetails = await Order.findById(id);
    // console.log(dishReviews);
    let newOrdersDetails = [...orderDetails.orders.toObject()];
    newOrdersDetails = newOrdersDetails.map((order, index) => {
        // console.log(order);
        if (dishReviews[index].dishId == order.dish._id) {
            return {
                ...order, review: {
                    rating: dishReviews[index].rating,
                    comment: dishReviews[index].comment
                }
            }
        }
    })
    console.log(newOrdersDetails);

    await Order.findByIdAndUpdate(id, {
        review: {
            rating: overallRating,
            comment: overallComment
        },
        orders: newOrdersDetails
    });

    const updateDishes = async () => dishReviews.forEach(async (review) => {
        await Dish.findByIdAndUpdate(review.dishId, { $push: { reviews: { rating: review.rating, comment: review.comment } } });
    })

    await updateDishes();

    res.status(200).json({ success: true, message: "Thanks for the feedback!" });
}));

module.exports = router;