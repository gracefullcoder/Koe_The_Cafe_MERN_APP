const express = require("express");
const { wrapAsync } = require("../utils/wrapAsyncAndExpressError");
const User = require("../models/user");
const router = express.Router();

router.get("/", wrapAsync(async (req, res) => {
    console.log("requested");
    const userId = req.user._id;
    const userCart = await User.findById(userId, 'cart').populate("cart.dish") || {cart:[]};
    res.status(200).json(userCart);
}))

router.patch("/add", wrapAsync(async (req, res) => {
    const { dish } = req.body;
    const userId = req.user._id;
    console.log(dish);
    await User.findByIdAndUpdate(userId, { $push: { cart: { dish: dish._id, quantity: 1 } } });
    console.log('add request');
    res.status(200).json({ success: true, message: `${dish.dishName} added to cart 😋!` })
}))


router.patch("/remove/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const dishData = await User.findByIdAndUpdate(req.user._id, { $pull: { cart: { dish: id } }});
    res.status(200).json({ success: true, message: `Removed from cart 🥺!` })
}))


router.patch("/inc/:id", wrapAsync(async (req, res) => {
    console.log("inc request in carrt");
    const { id } = req.params;
    console.log(id);
    const userId = req.user._id;
    const data = await User.findOneAndUpdate(
        { _id: userId, 'cart.dish': id },
        { $inc: { 'cart.$.quantity': 1 } }
    );
    res.status(200).json({ success: true, message: `Addded to cart!` });
}))


router.patch("/dec/:id", wrapAsync(async (req, res) => {
    console.log("dec request in carrt");
    const { id } = req.params;
    console.log(id);
    const userId = req.user._id;
    const data = await User.findOneAndUpdate(
        { _id: userId, 'cart.dish': id },
        { $inc: { 'cart.$.quantity': -1 } }
    );
    res.status(200).json({ success: true, message: `Decreased Quantity to cart!` });
}))




module.exports = router;

