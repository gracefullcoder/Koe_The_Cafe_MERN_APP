const mongoose = require("mongoose");
const { Schema } = mongoose;

const menuSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        image: {
            type: String
        },
        imageId: {
            type: String
        },
        dishes: [
            {
                type: Schema.ObjectId,
                ref: "Dish"
            }
        ]
    }
);

const Menu = mongoose.model("Menu", menuSchema);

module.exports = Menu;