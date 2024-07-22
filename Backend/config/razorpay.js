const Razorpay = require('razorpay');

let instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
}); 


instance.payments.fetch(paymentId)


var options = {
    amount: 50000,
    currency: "INR",
    receipt: "order_rcptid_11"
};
instance.orders.create(options, function (err, order) {
    console.log(order);
});
