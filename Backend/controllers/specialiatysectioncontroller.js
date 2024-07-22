const Specialslider = require("../models/specialsection.js");
const { uploadFile, deleteFile } = require("../config/imagekitconfig.js");
const { ExpressError } = require("../utils/wrapAsyncAndExpressError.js");

const showSpecialitySliders = async (req, res) => {
    let specialSliders = await Specialslider.find();
    res.status(200).json(specialSliders);
}

const createSpecialitySlider = async (req, res, next) => {
    let { label, title, text } = req.body;

    if (!req.file) {
        return next(new ExpressError(400, "You have not added image,Add required image and submit!"));
    }

    let myFile = req.file.originalname;
    let { fileUrl, fileId } = await uploadFile(myFile, "specialities");

    let specialitySlide = new Specialslider({ label: label, title: title, text: text, image: fileUrl, imageid: fileId })
    await specialitySlide.save();

    console.log(specialitySlide);

    return res.status(200).json({ success: true, message: "Added Speciality Successfully🎉!" ,newData:specialitySlide});
}

const destroySpecialSlider = async (req, res) => {
    let { id } = req.params;
    id = id.toString();
    let delData = await Specialslider.findByIdAndDelete(id);

    let imageid = delData.imageid;
    const data = await deleteFile(imageid);
    console.log(data);
    res.status(200).json({ success: true, message: "Delted Succesfully🎉" });
}

const updateSpecialitySlider = async (req, res, next) => {
    let { id } = req.params;
    let { label, title, text } = req.body;

    if (!req.file) {
        let updatedSlider = await Specialslider.findOneAndUpdate({ _id: id }, { label: label, title: title, text: text }, { new: true });
        return res.status(200).json({ success: true, message: "Edited SuccesFully, Click Preview to see updated Slider", updatedData: updatedSlider });

    }
    else {
        let myFile = req.file.originalname;
        let { fileUrl, fileId } = await uploadFile(myFile, "specialities");

        let specialitySlide = await Specialslider.findOneAndReplace({ _id: id }, { label: label, title: title, text: text, image: fileUrl, imageid: fileId });

        const oldimageid = specialitySlide.imageid;

        await deleteFile(oldimageid);

        const updatedSlider = await Specialslider.findById(id);
        return res.status(200).json({ success: true, message: "Edited SuccesFully, Click Preview to see updated Slider", updatedData: updatedSlider });
    }
}

module.exports = { showSpecialitySliders, createSpecialitySlider, destroySpecialSlider, updateSpecialitySlider };