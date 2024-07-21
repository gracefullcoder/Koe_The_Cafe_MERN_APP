const { registrationSchema, bookingsSchema, updateUserSchema } = require("../models/schema.js");

module.exports.validateUserUpdate = (req, res, next) => {
    let { error } = updateUserSchema.validate(req.body);
    if (error) {
        console.log(error);
        res.status(400).send(error.details[0].message);
        // throw new Error("Please enter valid details");
    } else {
        next();
    }
}


module.exports.validateRegistration = (req, res, next) => {
    let { error } = registrationSchema.validate(req.body);
    if (error) {
        console.log(error);
        res.status(400).send(error.details[0].message);
        // throw new Error("Please enter valid details");
    } else {
        next();
    }
}


module.exports.validateBookings = async (req, res, next) => {
    console.log(req.body);
    let { error } = bookingsSchema.validate(req.body);
    if (error) {
        console.log(error);
        next(new ExpressError(400, error.details[0].message));
    } else {
        next();
    }
}

module.exports.validateBookingUpdate = async (req, res, next) => {
    console.log(req.body);
    let { error } = editBookingSchema.validate(req.body);
    if (error) {
        console.log(error);
        next(new ExpressError(400, error.details[0].message));
    } else {
        next();
    }
}

module.exports.redirectAsRole = (req, res, next) => {
    let destinationUrl = req.originalUrl.toLowerCase();

    console.log(destinationUrl);
    if (destinationUrl.slice(1, 6) == "admin") {
        if (destinationUrl[7] == 'b') {
            req.session.redirectUrl = "/admin/bookings";
        } else if (destinationUrl[7] == 'w') {
            req.session.redirectUrl = "/admin/workshopsection"
        } else {
            req.session.redirectUrl = "/admin/testimonialsection";
        }
    } else {
        req.session.redirectUrl = "/dashboard?section=activity"
    }
    next();
}

module.exports.isTestimonialAdded = (req, res, next) => {
    if (req.user.testimonial) {
        return res.redirect("/dashboard?section=activity#testimonial");
    }
    next();
}