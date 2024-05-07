const ImageKit = require("imagekit");
const multer = require('multer');

const imagekit = new ImageKit({
    publicKey: "public_W8TYxH4QXoUCiGDLGtP4HBEpjFc=",
    privateKey: "private_QlHFE1GFwoAhSJB1qPJB0FiocTc=",
    urlEndpoint: "https://ik.imagekit.io/vaibhav11"
});

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

module.exports = {imagekit,storage};
