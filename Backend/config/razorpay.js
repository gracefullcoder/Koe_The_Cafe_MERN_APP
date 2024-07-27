const Razorpay = require('razorpay');
const crypto = require('crypto');

let instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});


const validateSignature = async (razorpayPaymentId, orderCreationId, razorpaySignature) => {
    const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);

    shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

    const digest = shasum.digest("hex");

    console.log(digest, razorpaySignature);

    if (digest === razorpaySignature) return true;

    return false;
}

module.exports = { instance, validateSignature };