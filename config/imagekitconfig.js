const ImageKit = require("imagekit");
const multer = require('multer');

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLICKEY,
    privateKey: process.env.IMAGEKIT_PRIVATEKEY,
    urlEndpoint:process.env.IMAGEKIT_URL_ENDPOINT 
});

//storage has 2 functions destination: kaha pai upload karna hai and fileName: what to set
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

module.exports = {imagekit,storage};
