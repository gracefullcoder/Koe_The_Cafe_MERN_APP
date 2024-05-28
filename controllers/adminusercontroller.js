const { ExpressError} = require("../utils/wrapAsyncAndExpressError");
const User = require("../models/user.js");
const path = require("path");
const fs = require('fs');
const { imagekit } = require("../config/imagekitconfig.js");
const Registration = require('../models/registration.js');
const Booking = require("../models/booking.js");
const Testimonial = require("../models/testimonials.js");
const Workshop = require("../models/workshop.js");
const Notification = require("../models/notifications.js");
const sendMail = require("../config/gmail.js");

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

    // console.log(userData);
    // console.log(workshopIds);
    let workshopdata = await Workshop.updateMany({ _id: { $in: workshopIds } },
        {
            $pull: { registrations: { $in: registrationsId } }
        }, { new: true });

    // console.log(workshopdata);
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

module.exports.notification = async (req, res) => {
    let { title, message, htmlContent } = req.body;
    let createdAt = new Date();
    let newNotification = new Notification({title,message,createdAt});
    await newNotification.save();
    await User.updateMany({},{$inc:{notificationRemaining : 1}});
    if (htmlContent) {
        let googleLoggedinUsers = await User.find({ 'federatedCredentials.subject': { $exists: true } }, { _id: 0, username: 1 });
        googleLoggedinUsers = googleLoggedinUsers.map((user) => user.username);
        // console.log(googleLoggedinUsers);
        const mailData = {
            from: 'Koe the Cafe🍵<codingvaibhav247@gmail.com>',
            to: googleLoggedinUsers,
            subject: title,
            text: message,
            html: htmlContent
        }
        sendMail(mailData).then(result => console.log(`mail sent successfully this is result : ${result}`))
            .catch(err => console.log("error bheja ye", err))
    }

    res.send("Notification Added Successfully !");
}


module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    let user = await User.findById(id);
    res.render("admindashboard/edituser.ejs", { user });
}


module.exports.updateUser = async (req, res, next) => {
    let { id } = req.params;
    console.log(req.body);
    let { fullname, gender, DOB, imagecheckbox } = req.body;
    fullname = fullname.toString();
    gender = gender.toString();
    // console.log("-------", req.file)
    if (!imagecheckbox) {
        let document = await User.findOneAndUpdate({ _id: id }, { fullname: fullname, gender: gender, DOB: DOB });
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
