const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema({
    status: {
        type: String,
        required: "true",
        default: "Ordered"
    },
    orders: [
        {
            dish: {
                type: Object,
            },
            status: {
                type: String,
                default: "Ordered"
            },
            quantity: {
                type: Number
            },
            review: {
                comment: String,
                rating: Number
            }
        }

    ],
    totalAmount: {
        type: Number
    },
    duration: {
        type: String
    },
    paymentMethod: {
        type: String,
        default: "Cash On Order"
    },
    user: {
        type: Schema.ObjectId,
        ref: "User"
    },
    review: {
        rating: {
            type: Number
        },
        comment: {
            type: String
        }
    }
},
    {
        timestamps: true
    })

let Order = new mongoose.model("Order", orderSchema);

module.exports = Order;