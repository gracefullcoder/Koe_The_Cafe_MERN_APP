const express = require("express");
const router = express.Router();
const { instance, validateSignature } = require("../config/razorpay");
const { wrapAsync } = require("../utils/wrapAsyncAndExpressError");
const Order = require("../models/order");
const User = require("../models/user");
const Dish = require("../models/dish");
const { isAdmin } = require("../middlewares/adminmiddlewares");

router.post("/payment", wrapAsync(async (req, res) => {
    const { totalAmount } = req.body;

    const options = {
        amount: totalAmount * 100,
        currency: "INR",
        receipt: `reciept_${Math.floor(Math.random() * 10000000)}`,
    };

    const order = await instance.orders.create(options);

    if (!order) return res.status(500).send("Some error occured");

    res.status(200).json(order);
}))

router.post("/payment/success", wrapAsync(async (req, res) => {
    const { orderDetails, orderCreationId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

    if (!validateSignature(razorpayPaymentId, orderCreationId, razorpaySignature)) {
        return res.status(400).json({ msg: "Transaction not legit!" });
    }

    let totalAmount = orderDetails.reduce((acc, order) => { return acc + (order.dish.price * order.quantity) }, 0);
    const userId = req.user;
    const newOrder = new Order({ orders: orderDetails, totalAmount: totalAmount, user: userId });
    const order = await newOrder.save();
    await User.findByIdAndUpdate(userId, { $push: { 'orders': order._id }, cart: [] });
    let io = req.app.get('socket.io');
    io.emit("new-order", order);


    res.status(200).json({
        success: true, message: "Order Placed Successfully!",
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId
    });

}));


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
        res.status(200).json({ success: true, message: "Order Updated Successfully!", updatedTime: new Date() });
    }))

module.exports = router;