const { ExpressError } = require("../utils/wrapAsyncAndExpressError");
const User = require("../models/user.js");
const path = require("path");
const fs = require('fs');
const { imagekit } = require("../config/imagekitconfig.js");
const Registration = require('../models/registration.js');
const Booking = require("../models/booking.js");
const Testimonial = require("../models/testimonials.js");
const Workshop = require("../models/workshop.js");
const PreviewImage = require("../models/previewImage.js");

module.exports.previewImage = async (req, res, next) => {
    const prevImage = await PreviewImage.find();
    const myFile = req.file.originalname;
    const fileLocation = path.join("./uploads", myFile);

    fs.readFile(fileLocation, async (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return next(new ExpressError(500, "Error reading file."));
        }

        imagekit.upload({
            file: data,
            fileName: myFile,
            folder: "/Koe_Cafe/previewImage"
        }, async (error, result) => {
            if (error) {
                console.error("Error uploading image:", error);
                return next(new ExpressError(406, "Error in uploading image! Add a valid image."));
            } else {
                const image = result.url;
                const imageid = result.fileId;
                let document;

                if (prevImage.length > 0) {
                    document = await PreviewImage.findOneAndReplace({ _id: prevImage[0]._id }, { image, imageid });
                    const oldimageid = document.imageid;

                    imagekit.deleteFile(oldimageid)
                        .then(response => {
                            console.log("Deleted old image:", response);
                        })
                        .catch(deleteError => {
                            console.error("Error deleting old image:", deleteError);
                        });
                } else {
                    document = await PreviewImage.create({ image, imageid });
                }

                fs.unlinkSync(fileLocation);
                return res.status(200).json({ success: true, message: "Preview Image Updated Successfully", image });
            }
        });
    });
}


module.exports.showUsers = async (req, res) => {
    let users = await User.find({});
    let adminUsers = [];
    let normalUsers = [];

    for (let user of users) {
        // console.log(user.role.admin);
        if (user.role.admin) {
            adminUsers.push(user);
        } else {
            normalUsers.push(user);
        }
    }
    console.log(normalUsers, adminUsers);
    res.status(200).json({ adminUsers, normalUsers });
}


module.exports.destroyUser = async (req, res) => {
    console.log("request to delete user");
    let { id } = req.params;
    let userData = await User.findById(id);
    // console.log("this is", userData);
    const registrationsId = userData.workshopsRegistered;

    await Registration.deleteMany({ _id: { $in: registrationsId } });
    await Booking.deleteMany({ _id: { $in: userData.bookings } });
    await Testimonial.findByIdAndDelete(userData.testimonial);

    await userData.populate("workshopsRegistered");
    let workshopIds = userData.workshopsRegistered.map((registration) => {
        return registration.workshop;
    })


    let workshopdata = await Workshop.updateMany({ _id: { $in: workshopIds } },
        {
            $pull: { registrations: { $in: registrationsId } }
        }, { new: true });

    if (userData.profilepicture.isUpdated) {
        imagekit.deleteFile(userData.profilepicture.imageid)
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.log(error);
                throw error;
            });
    }
    await User.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "User Deleted Succesfully!" });
}


module.exports.assignAdmin = async (req, res) => {
    let { id } = req.params;
    const role = {
        admin: true,
        creatorname: req.user.fullname,
        creatoremail: req.user.username
    }

    const user = await User.findByIdAndUpdate(id, { $set: { role: role } });
    res.status(200).json({ success: true, message: `${user.fullname} is now Admin!`, role });
}


module.exports.unAssignAdmin = async (req, res) => {
    let { id } = req.params;
    let user = await User.findByIdAndUpdate(id, { $unset: { role: true } }, { new: true });
    res.status(200).json({ success: true, message: `${user.fullname} is now Normal User!` });
}


module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    let user = await User.findById(id);
    res.status(200).json({ id: user._id, fullname: user.fullname, DOB: user.DOB, gender: user.gender });
}


module.exports.updateUser = async (req, res, next) => {
    let { id } = req.params;
    console.log(req.body);
    let { fullname, gender, DOB } = req.body;
    fullname = fullname.toString();
    gender = gender.toString();

    if (!req.file) {
        let document = await User.findOneAndUpdate({ _id: id }, { fullname: fullname, gender: gender, DOB: DOB });
        return res.json({ success: true, message: `${fullname} Updated Successfully!` })
    }
    else {
        if (!req.file) {
            throw next(new ExpressError(400, "Image not Added, Please select required image"));
        }

        let myFile = req.file.originalname;
        let fileLocation = path.join("./uploads", myFile);
        fs.readFile(fileLocation, async (err, data) => {
            if (err) throw next(new ExpressError(400, "Please Enter Valid file Name!"));

            imagekit.upload({
                file: data,
                fileName: myFile,
                folder: "/Koe_Cafe/profilephoto"
            },
                async function (error, result) {
                    if (error) {
                        console.log(error);
                        return next(new ExpressError(406, "Error in Uploading Image!,Add a vallid image."));
                    }
                    else {
                        let image = result.url;
                        let imageid = result.fileId;
                        let profilepicture = {
                            isUpdated: true,
                            imageid: imageid,
                            imagelink: image,
                        }
                        let oldData = await User.findOneAndUpdate({ _id: id }, { fullname: fullname, gender: gender, DOB: DOB, profilepicture: profilepicture });
                        console.log(oldData);
                        if (oldData.profilepicture.isUpdated) {
                            imagekit.deleteFile(oldData.profilepicture.imageid)
                                .then(response => {
                                    console.log(response);
                                })
                                .catch(error => {
                                    console.log(error);
                                    throw error;
                                });
                        }
                        fs.unlinkSync(fileLocation);
                        res.json({ success: true, message: `${fullname} Updated Successfully!` })
                    }
                });
        });

    }
}