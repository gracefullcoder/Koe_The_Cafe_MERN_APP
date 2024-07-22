const mongoose = require("mongoose");

const previewSchema = new mongoose.Schema({
    
    image: {
        type: String,
        required:true
    },
    imageid: {
        type: String,
        required:true
    }
})

const PreviewImage = mongoose.model("PreviewImage", previewSchema);

module.exports = PreviewImage;