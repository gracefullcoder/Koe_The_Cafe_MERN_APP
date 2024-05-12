const express = require('express');
const { ExpressError} = require("../utils/wrapAsyncAndExpressError");
const User = require("../models/user.js");
const path = require("path");
const fs = require('fs');
const { imagekit } = require("../config/imagekitconfig.js");


module.exports.selectSection = async (req, res) => {
    let { section } = req.body;
    section = "/admin/" + section.toString().toLowerCase();
    res.redirect(section);
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
    // console.log(normalUsers, adminUsers);
    res.render("admindashboard/addadmin.ejs", { adminUsers, normalUsers });
}


module.exports.destroyUser = async (req, res) => {
    let { id } = req.params;
    let user = await User.findByIdAndDelete(id);
    console.log(user);

    if (user.profilepicture.isUpdated) {
        imagekit.deleteFile(user.profilepicture.imageid)
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.log(error);
                throw error;
            });
    }
    // console.log(user);
    res.redirect("/admin/addadmin");
}


module.exports.assignAdmin = async (req, res) => {
    let { id } = req.params;
    let user = await User.findById(id);
    user.role = {
        admin: true,
        creatorname: req.user.fullname,
        creatoremail: req.user.username
    }

    await User.findByIdAndUpdate(id, user);
    res.redirect("/admin/addadmin");
}


module.exports.unAssignAdmin = async (req, res) => {
    let { id } = req.params;
    let user = await User.findById(id);
    let data = await User.findByIdAndUpdate(id, { $unset: { role: true } }, { new: true }); //unset option use hota hai to remove key from object mongoose(unset role true)
    res.redirect("/admin/addadmin");
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    let user = await User.findById(id);
    res.render("admindashboard/edituser.ejs", { user });
}


module.exports.updateUser = async (req, res) => {
    let { id } = req.params;
    console.log(req.body);
    let { fullname, gender, imagecheckbox } = req.body;
    fullname = fullname.toString();
    gender = gender.toString();

    if (!imagecheckbox) {
        let document = await User.findOneAndUpdate({ _id: id }, { fullname: fullname, gender: gender });
        return res.redirect("/admin/addadmin"); //yaha pe else hai nahi tho return lagana must
    }
    else {
        if (!req.file) {
            throw next(new ExpressError(400, "Image not Added, Please select required image")); //throw / return and next as parameter
        }

        let myFile = req.file.originalname;
        let fileLocation = path.join("./uploads", myFile);
        fs.readFile(fileLocation, async (err, data) => {
            if (err) throw next(new ExpressError(400, "Please Enter Valid file Name!"));

            imagekit.upload({
                file: data,   //required
                fileName: myFile,   //required
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
                        let oldData = await User.findOneAndUpdate({ _id: id }, { fullname: fullname, gender: gender, profilepicture: profilepicture });
                        console.log(oldData);
                        if (oldData.profilepicture.isUpdated) {
                            imagekit.deleteFile(oldData.profilepicture.imageid)
                                .then(response => {
                                    console.log(response);
                                })
                                .catch(error => {
                                    console.log(error);
                                    throw error; //promise chaining catch and This error will propagate to the next catch block(wrapAsync) 
                                });
                        }
                        fs.unlinkSync(fileLocation);
                        res.redirect("/admin/addadmin");
                    }
                });
        });

    }
}
