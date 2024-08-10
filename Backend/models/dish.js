const mongoose = require("mongoose");
const { Schema } = mongoose;

const dishSchema = new Schema(
    {
        dishName: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        dishImage: {
            type: String
        },
        imageId: {
            type: String
        },
        price: {
            type: Number
        },
        tag: {
            type: String
        },
        reviews: [{
            _id: false,
            comment: {
                type: String,
            },
            rating: Number
        }],
        available: {
            type: Boolean,
            default: true
        }
    }
);

const Dish = mongoose.model("Dish", dishSchema);

module.exports = Dish;
