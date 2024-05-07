const Heroslider = require("../models/herosection");
const path = require("path");
const fs = require('fs');
const { imagekit } = require("../config/imagekitconfig.js");

const showHeroSliders = async (req, res) => {
    let heroSliders = await Heroslider.find();
    res.render("herosection/herosection.ejs", { heroSliders });
}

const createHeroSlider = async (req, res) => {
    let { label, title, text } = req.body;
    label = label.toString();
    title = title.toString();
    text = text.toString();
    let myFile = req.file.originalname; // multer nai parse karke de diya isliye read kar pa rahe req.file
    let fileLocation = path.join("./uploads", myFile);

    fs.readFile(fileLocation, async (err, data) => {
        if (err) throw err; // Fail if the file can't be read.
        imagekit.upload({
            file: data, //required
            fileName: myFile, //required
        }, async function (error, result) {
            if (error) console.log(error);
            else {
                // console.log(result);
                let image = await result.url;
                let imageid = await result.fileId;
                let data = new Heroslider({ label: label, title: title, text: text, image: image, imageid: imageid })
                await data.save();
                console.log(data);
                fs.unlinkSync(fileLocation);
                res.redirect("/admin/herosection");
            }
        });
    });
}

const destroyHeroSlider = async (req, res) => {
    let { id } = req.params;
    id = id.toString();
    let delData = await Heroslider.findByIdAndDelete(id);

    let imageid = delData.imageid;

    imagekit.deleteFile(imageid)
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.log(error);
        });
    res.redirect("/admin/herosection");
}

const renderEditForm = async (req, res) => {
    let { id } = req.params;
    id = id.toString();
    let data = await Heroslider.find({ _id: id });
    console.log(data);
    res.render("herosection/editherosection.ejs", { data });
}

const updateHeroSlider = async (req, res) => {
    let { id } = req.params;
    let { label, title, text, imagecheckbox } = req.body;
    label = label.toString();
    title = title.toString();
    text = text.toString();

    if (!imagecheckbox) {
        let document = await Heroslider.findOneAndUpdate({ _id: id }, { label: label, title: title, text: text });
        res.redirect("/admin/herosection");
    }
    else {
        let myFile = req.file.originalname;
        let fileLocation = path.join("./uploads", myFile);
        fs.readFile(fileLocation, async (err, data) => {

            if (err) throw err;  // Fail if the file can't be read.
            imagekit.upload({
                file: data,   //required
                fileName: myFile,   //required
            },
                async function (error, result) {
                    if (error) console.log(error);
                    else {
                        // console.log(result);
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
                            });

                        fs.unlinkSync(fileLocation);
                        res.redirect("/admin/herosection");
                    }
                });
        });

    }
}


module.exports = { showHeroSliders, createHeroSlider, destroyHeroSlider, renderEditForm, updateHeroSlider };


