const Testimonial = require("../models/testimonials.js");
const path = require("path");
const fs = require('fs');
const { imagekit } = require("../config/imagekitconfig.js");
const { ExpressError } = require("../utils/wrapAsyncAndExpressError.js");

const showTestimonials = async (req, res) => {
    let testimonials = await Testimonial.find();
    res.render("testimonialsection/testimonials.ejs", { testimonials });
}

const createTestimonial = async (req, res, next) => {
    let { name, review } = req.body;
    name = name.toString();
    review = review.toString();

    if (!req.file) {
        let data = new Testimonial({ name: name, review: review });
        await data.save();
        return res.redirect("/admin/testimonialsection");
    }

    let myFile = req.file.originalname;
    let fileLocation = path.join("./uploads", myFile);
    fs.readFile(fileLocation, async (err, data) => {
        if (err) throw next(new ExpressError(400, "Please Enter Valid file image is required!"));

        imagekit.upload({
            file: data, //required
            fileName: myFile, //required
        }, async function (error, result) {
            if (error) throw next(new ExpressError(406, "Error in Uploading Image!"));
            else {
                // console.log(result);
                let profilephoto = result.url;
                let imageid = result.fileId;
                let data = new Testimonial({ name: name, review: review, profilephoto: profilephoto, imageid: imageid });
                await data.save();
                console.log(data);
                fs.unlinkSync(fileLocation);
                res.redirect("/admin/testimonialsection");
            }
        });
    });
}


const destroyTestimonial = async (req, res) => {
    let { id } = req.params;
    id = id.toString();
    let delData = await Testimonial.findByIdAndDelete(id);

    let imageid = delData.imageid;

    imagekit.deleteFile(imageid)
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.log(error);
            throw error;
        });

    res.redirect("/admin/testimonialsection");
}

const renderEditForm = async (req, res) => {
    let { id } = req.params;
    id = id.toString();
    let data = await Testimonial.find({ _id: id });
    console.log(data);
    res.render("testimonialsection/edittestimonials.ejs", { data });
}

const updateTestimonial = async (req, res,next) => {
    let { id } = req.params;
    let { name, review, imagecheckbox } = req.body;
    name = name.toString();
    review = review.toString();

    console.log(req.body);

    if (!imagecheckbox) {
        let document = await Testimonial.findOneAndUpdate({ _id: id }, { name: name, review: review });
        res.redirect("/admin/testimonialsection");
    }
    else {
        if (!req.file) {
            return next(new ExpressError(400, "You have not added image,Add required image and submit!"));
        }

        let myFile = req.file.originalname;
        let fileLocation = path.join("./uploads", myFile);
        fs.readFile(fileLocation, async (err, data) => {
            if (err) throw next(new ExpressError(400, "Please Enter Valid file image is required!"));

            imagekit.upload({
                file: data,   //required
                fileName: myFile,   //required
            },
                async function (error, result) {
                    if (error) {
                        console.log(error);
                        throw next(new ExpressError(406, "Error in Uploading Image!"))
                    }
                    else {
                        // console.log(result);
                        let profilephoto = result.url;
                        let imageid = result.fileId;
                        let document = await Testimonial.findOneAndReplace({ _id: id }, { name: name, review: review, profilephoto: profilephoto, imageid: imageid });

                        let oldimageid = document.imageid;
                        if (oldimageid) {
                            imagekit.deleteFile(oldimageid)
                                .then(response => {
                                    console.log(response);
                                })
                                .catch(error => {
                                    console.log(error);
                                });
                        }
                        fs.unlinkSync(fileLocation);
                        res.redirect("/admin/testimonialsection");
                    }
                });
        });
    }

}

module.exports = { showTestimonials, createTestimonial, destroyTestimonial, renderEditForm, updateTestimonial };
