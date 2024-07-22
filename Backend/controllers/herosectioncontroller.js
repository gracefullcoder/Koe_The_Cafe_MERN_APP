const Heroslider = require("../models/herosection");
const path = require("path");
const fs = require('fs');
const { imagekit } = require("../config/imagekitconfig.js");
const { ExpressError } = require("../utils/wrapAsyncAndExpressError.js");

const showHeroSliders = async (req, res) => {
    let heroSliders = await Heroslider.find();
    console.log("sent heroSliders");
    res.status(200).json(heroSliders);
}

const createHeroSlider = async (req, res, next) => {
    let { label, title, text } = req.body;
    label = label.toString();
    title = title.toString();
    text = text.toString();

    if (!req.file) {
        throw next(new ExpressError(400, "You have not added image,Add required image and submit!"));
    }

    let myFile = req.file.originalname; // multer nai parse karke de diya isliye read kar pa rahe req.file

    let fileLocation = path.join("./uploads", myFile);

    fs.readFile(fileLocation, async (err, data) => {
        // Fail if the file can't be read. errcatch hojayega by wrapAsync
        if (err) throw next(new ExpressError(400, "Please Enter Valid file Name!"));

        imagekit.upload({
            file: data, //fs read kiya and valid path tho data is file
            fileName: myFile, //req.file se mil gaya
            folder: "/Koe_Cafe/herosection"
        }, async function (error, result) {
            if (error) {
                console.log(error);
                throw next(new ExpressError(406, "Error in Uploading Image!"));
            }
            else {
                let image = await result.url;
                let imageid = await result.fileId;
                let data = new Heroslider({ label: label, title: title, text: text, image: image, imageid: imageid })
                await data.save();
                console.log(data);
                fs.unlinkSync(fileLocation); // to delete file at that location
                res.json({ success: true, message: "Website Modified Succesfully🎉",newData : data })
            }
        });
    });
}

const destroyHeroSlider = async (req, res) => {
    console.log("requested to delted hero");
    let { id } = req.params;
    let delData = await Heroslider.findByIdAndDelete(id);

    let imageid = delData.imageid; //old data

    imagekit.deleteFile(imageid)//takes imageid and delete the post
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.log(error);
            throw error;
        });
    res.json({ success: true, message: "Deleted Succesfully 🎉" });
}

const updateHeroSlider = async (req, res, next) => {
    let { id } = req.params;
    let { label, title, text, imagecheckbox } = req.body;
    label = label.toString();
    title = title.toString();
    text = text.toString();

    if (!req.file) {
        let updatedSlider = await Heroslider.findOneAndUpdate({ _id: id }, { label: label, title: title, text: text }, { new: true });
        return res.status(200).json({ success: true, message: "Edited SuccesFully, Click Preview to see updated Slider",updatedData: updatedSlider }); //yaha pe else hai nahi tho return lagana must
    }
    else {
        // if (!req.file) {
        //     throw next(new ExpressError(400, "Image not Added, Please select required image")); //throw / return and next as parameter
        // }

        let myFile = req.file.originalname;
        let fileLocation = path.join("./uploads", myFile);
        fs.readFile(fileLocation, async (err, data) => {
            if (err) throw next(new ExpressError(400, "Please Enter Valid file Name!"));

            imagekit.upload({
                file: data,   //required
                fileName: myFile,   //required
                folder: "/Koe_Cafe/herosection"
            },
                async function (error, result) {
                    if (error) {
                        console.log(error);
                        return next(new ExpressError(406, "Error in Uploading Image!,Add a vallid image."));
                    }
                    else {
                        let image = result.url;
                        let imageid = result.fileId;
                        let document = await Heroslider.findOneAndReplace({ _id: id }, { label: label, title: title, text: text, image: image, imageid: imageid });

                        let oldimageid = document.imageid;

                        imagekit.deleteFile(oldimageid)
                            .then(response => {
                                console.log(response);
                            })
                            .catch(error => {
                                console.log(error);
                                throw error; //promise chaining catch and This error will propagate to the next catch block(wrapAsync) 
                            });

                        fs.unlinkSync(fileLocation);
                        const updatedSlider = await Heroslider.findById(id);
                        return res.status(200).json({ success: true, message: "Edited SuccesFully, Click Preview to see updated Slider",updatedData: updatedSlider });
                    }
                });
        });

    }
}


module.exports = { showHeroSliders, createHeroSlider, destroyHeroSlider, updateHeroSlider };