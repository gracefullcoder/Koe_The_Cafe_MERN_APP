const { newSectionSchema, eventSchema, testimonialSchema, countDownSchema, editSchema } = require("../models/schema.js");

module.exports.validateNewSection = (req, res, next) => {
    const { error } = newSectionSchema.validate(req.body);
    if (error) {
        console.log(error);
        res.status(400).send(error.details[0].message);
    } else {
        next();
    }
}

module.exports.validateEventSection = (req, res, next) => {
    const { error } = eventSchema.validate(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
    } else {
        next();
    }
}


module.exports.validateTestimonial = (req, res, next) => {
    const { error } = testimonialSchema.validate(req.body);

    if (error) {
        console.log(req.body);
        res.status(400).send(error.details[0].message);
    } else {
        next();
    }
}

module.exports.validateCountdownEdit = (req, res, next) => {
    const { error } = countDownSchema.validate(req.body);

    if (error) {
        console.log(req.body);
        res.status(400).send(error.details[0].message);
    } else {
        next();
    }
}

module.exports.validateEdit = (req, res, next) => {
    const { error } = editSchema.validate(req.body);
    if (error) {
        console.log(typeof (req.body.imagecheckbox));
        res.status(400).send(error.details[0].message);
    } else {
        next();
    }
}


module.exports.isAdmin = (req, res, next) => {
    // console.log(req);
    if (req.isAuthenticated()) {
        if (req.user.role.admin) {
            next();
        } else {
            return res.send("You Don't Have Admin Rights further Logins attempt will lead to block of account!");
        }
    } else {
        req.session.redirectUrl = req.originalUrl; //redirect url session mai stor karliya
        return res.redirect("/auth/login");
    }
}


//after login authentication passport automatically session ke data ko delete karde ta hai, therfore one more middleware which will
// call before authenticating the login post request and store this is res.local as locals is accesibble everywhere and passport
//don't have access to delete locals

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

