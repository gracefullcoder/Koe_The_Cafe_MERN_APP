const {registrationSchema,bookingsSchema,updateUserSchema} = require("../models/schema.js");

module.exports.validateUserUpdate = (req, res, next) => {
    let { error} = updateUserSchema.validate(req.body);
    if (error) {
        console.log(error);
        res.status(400).send(error.details[0].message);
        // throw new Error("Please enter valid details");
    } else {
        next();
    }
}


module.exports.validateRegistration = (req, res, next) => {
    let { error} = registrationSchema.validate(req.body);
    if (error) {
        console.log(error);
        res.status(400).send(error.details[0].message);
        // throw new Error("Please enter valid details");
    } else {
        next();
    }
}


module.exports.validateBookings = async (req,res,next) => {
    let {error} = bookingsSchema.validate(req.body);
    if(error){
        console.log(error);
        res.status(400).send(error.details[0].message);
    } else{
        next();
    }
}

module.exports.isTestimonialAdded = (req,res,next) => {
    if(req.user.testimonial){
        return res.redirect("/dashboard?section=activity#testimonial");
    }
    next();
}