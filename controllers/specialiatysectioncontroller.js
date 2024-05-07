const Specialslider = require("../models/specialsection.js");
const path = require("path");
const fs = require('fs');
const { imagekit } = require("../config/imagekitconfig.js");

const showSpecialitySliders = async (req, res) => {
    let specialSliders = await Specialslider.find();
    // let heroSliders = await Heroslider.find();
    res.render("specialitysection/specialsection.ejs", { specialSliders });
}

const createSpecialitySlider = async (req, res) => {
    let { label, title, text } = req.body;
    label = label.toString();
    title = title.toString();
    text = text.toString();
    let myFile = req.file.originalname;
    fileLocation = path.join("./uploads", myFile);
    // console.log(image);
    fs.readFile(fileLocation, async (err, data) => {
        if (err) throw err; // Fail if the file can't be read.
        imagekit.upload({
            file: data, //required
            fileName: myFile, //required
        }, async function (error, result) {
            if (error) console.log(error);
            else {
                // console.log(result);
                let image = result.url;
                let imageid = result.fileId;
                let data = new Specialslider({ label: label, title: title, text: text, image: image, imageid: imageid })
                await data.save();
                console.log(data);
                fs.unlinkSync(fileLocation);
                res.redirect("/admin/specialitysection");
            }
        });
    });
}

const destroySpecialSlider = async (req, res) => {
    let { id } = req.params;
    id = id.toString();
    let delData = await Specialslider.findByIdAndDelete(id);

    let imageid = delData.imageid;

    imagekit.deleteFile(imageid)
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.log(error);
        });
    // console.log(id);
    res.redirect("/admin/specialitysection");
}

const renderEditForm = async (req, res) => {
    let { id } = req.params;
    id = id.toString();
    let data = await Specialslider.find({ _id: id });
    console.log(data);
    res.render("specialitysection/editspecialsection.ejs", { data });
}

const updateSpecialitySlider = async (req, res) => {
    let { id } = req.params;
    let { label, title, text, imagecheckbox } = req.body;
    label = label.toString();
    title = title.toString();
    text = text.toString();
    // console.log(req.body);

    if (!imagecheckbox) {
        let document = await Specialslider.findOneAndUpdate({ _id: id }, { label: label, title: title, text: text });
        res.redirect("/admin/specialitysection");
    }
    else {
        let myFile = req.file.originalname;
        let fileLocation = path.join("./uploads", myFile);
        fs.readFile(fileLocation, async (err, data) => {

            if (err) throw err;   // Fail if the file can't be read.
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
                        let document = await Specialslider.findOneAndReplace({ _id: id }, { label: label, title: title, text: text, image: image, imageid: imageid });

                        let oldimageid = document.imageid;

                        imagekit.deleteFile(oldimageid)
                            .then(response => {
                                console.log(response);
                            })
                            .catch(error => {
                                console.log(error);
                            });

                        fs.unlinkSync(fileLocation);
                        res.redirect("/admin/specialitysection");
                    }
                });
        });
    }

}

module.exports = {showSpecialitySliders,createSpecialitySlider,destroySpecialSlider,renderEditForm,updateSpecialitySlider};