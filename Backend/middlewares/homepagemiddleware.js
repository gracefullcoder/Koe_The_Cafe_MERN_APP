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


module.exports.validateBooking = async (req, res, next) => {
    console.log(req.body);
    let { error } = bookingsSchema.validate(req.body);
    if (error) {
        console.log(error);
        next(new ExpressError(400, error.details[0].message));
    } else {
        next();
    }
}

module.exports.validateBookingTiming = async (req, res, next) => {
    const data = req.body;

    const isValidDate = (date) => {
        return !isNaN(Date.parse(date));
    }

    if (!isValidDate(data.date)) {
        return next(new ExpressError(400, 'Please input valid Booking Date'));
    }

    if (!(data.startTime && data.endTime)) {
        return next(new ExpressError(400, 'Please input valid start time and end time'));
    }

    let startTime = new Date(`${data.date}T${data.startTime}`);
    const currentDate = new Date();

    if (currentDate > startTime) {
        return next(new ExpressError(400, "Can't book a seat in the past. Please contact Poonam Pandey!"));
    }

    let endTime = new Date(`${data.date}T${data.endTime}`);
    if (data.endTime == '00:00') {
        endTime.setDate(endTime.getDate() + 1);
    }
    const storeOpenTime = new Date(`${data.date}T12:00:00`);
    const storeCloseTime = new Date(`${data.date}T00:00:00`);

    storeCloseTime.setDate(storeCloseTime.getDate() + 1);

    if (startTime > endTime) {
        return next(new ExpressError(400, 'NOTE: Store Closes at 12:00 AM , Start time should be before end time'));

    }

    if (startTime < storeOpenTime) {
        return next(new ExpressError(400, 'Store will be closed at your start time, starts at 12:00 PM'));
    } else if (endTime > storeCloseTime) {
        return next(new ExpressError(400, 'Store closes at 12:00 AM'));
    }

    return next();
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