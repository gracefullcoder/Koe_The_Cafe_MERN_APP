const Testimonial = require("../models/testimonials.js");
const path = require("path");
const fs = require('fs');
const { imagekit } = require("../config/imagekitconfig.js");
const { ExpressError } = require("../utils/wrapAsyncAndExpressError.js");
const User = require("../models/user.js");

const showTestimonials = async (req, res) => {
    let testimonials = await Testimonial.find().populate("user");
    res.render("testimonialsection/testimonials.ejs", { testimonials });
}

const createTestimonial = async (req, res, next) => {
    let { suggestion, review } = req.body;
    console.log("datata", req.body);
    if (!req.file) {
        let testimonialData = new Testimonial({suggestion:suggestion, review: review });
        testimonialData.profilephoto = req.user.profilepicture.imagelink;
        testimonialData.user = req.user._id;
        await testimonialData.save();
        await User.findByIdAndUpdate(req.user._id, { testimonial: testimonialData._id })
        return res.redirect("/admin/testimonialsection");
    }

    let myFile = req.file.originalname;
    let fileLocation = path.join("./uploads", myFile);
    fs.readFile(fileLocation, async (err, data) => {
        if (err) throw next(new ExpressError(400, "Please Enter Valid file image is required!"));

        imagekit.upload({
            file: data, //required
            fileName: myFile, //required
            folder: "/Koe_Cafe/profilephoto"
        }, async function (error, result) {
            if (error) throw next(new ExpressError(406, "Error in Uploading Image!"));
            else {
                let profilephoto = result.url;
                let imageid = result.fileId;
                let testimonialData = new Testimonial({suggestion:suggestion, review: review});
                testimonialData.user = req.user._id;
                await testimonialData.save();
                let profilePicture = {
                    isUpdated: true,
                    imageid: imageid,
                    imagelink: profilephoto
                }
                await User.findByIdAndUpdate(req.user._id, { testimonial: testimonialData._id, profilepicture: profilePicture })
                fs.unlinkSync(fileLocation);
                res.redirect("/admin/testimonialsection");
            }
        });
    });
}


const destroyTestimonial = async (req, res) => {
    let { id } = req.params;
    id = id.toString();
    let delTestimonial = await Testimonial.findByIdAndDelete(id);
    await User.findByIdAndUpdate(delTestimonial.user, { testimonial: null });

    // if(req.user.role.isAdmin){
    //     return res.redirect("/admin/testimonialsection");
    // }else{
        return res.redirect("/");
    // }
}

const renderEditForm = async (req, res) => {
    let { id } = req.params;
    id = id.toString();
    let data = await Testimonial.find({ _id: id });
    console.log(data);
    res.render("testimonialsection/edittestimonials.ejs", { data });
}

const updateTestimonial = async (req, res, next) => {
    let { id } = req.params;
    let { suggestion, review } = req.body;

    console.log(req.body);

    let document = await Testimonial.findOneAndUpdate({ _id: id }, {suggestion:suggestion, review: review });

    // if(req.user.role.admin){
    //     return res.redirect("/admin/testimonialsection");
    // }else{
        return res.redirect("/");
    // }
}

module.exports = { showTestimonials, createTestimonial, destroyTestimonial, renderEditForm, updateTestimonial };
