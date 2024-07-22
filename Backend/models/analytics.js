const mongoose = require("mongoose");
const { Schema } = mongoose;

const analyticsSchema = new Schema({
    userName: {
        type: String
    },
    createdAt: {    
        type: Date,
        default: Date.now
    },
    action: {
        key: {
            type: String
        },
        description:{
            type:String
        }
    },
    pageVisited: {
        type: String
    },
    menuLookup: {
        type: String
    },
    dishAdded: {
        dishId: {
            type: Schema.Types.ObjectId,
            ref: 'Dish'
        },
        dishName: {
            type: String
        }
    },
    LinkVisited: {
        type: String
    }
})


let TrafficAnalytics = new mongoose.model('TrafficAnalytics', analyticsSchema);

module.exports = TrafficAnalytics;