const ImageKit = require("imagekit");
const multer = require('multer');
const fs = require("fs").promises;
const { ExpressError } = require("../utils/wrapAsyncAndExpressError.js");
const path = require("path")

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLICKEY,
    privateKey: process.env.IMAGEKIT_PRIVATEKEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
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


const uploadFile = async (fileName, folderName) => {
    const fileLocation = path.join("./uploads", fileName);
    const fileData = {};

    try {
        const data = await fs.readFile(fileLocation);
        const result = await new Promise((resolve, reject) => {
            imagekit.upload({
                file: data,
                fileName: fileName,
                folder: `/Koe_Cafe/${folderName}`
            }, (error, result) => {
                if (error) reject(new ExpressError(406, "Error in Uploading Image!"));
                else resolve(result);  //resolve ke aandar argumet is then stored in upper result variable
            });
        });
        await fs.unlink(fileLocation);

        fileData["fileUrl"] = result.url;
        fileData["fileId"] = result.fileId;
        return fileData;

    } catch (error) {
        console.log(error);
        throw new ExpressError(400, "Please Enter Valid file image is required!");
    }
}


const deleteFile = async (fileId) => {
    let result = false;
    await imagekit.deleteFile(fileId)
        .then(response => {
            console.log(response);
            result = true;
        })
        .catch(error => {
            console.log(error);
            throw error;
        });
    return result;
}

module.exports = { imagekit, storage, uploadFile ,deleteFile};
