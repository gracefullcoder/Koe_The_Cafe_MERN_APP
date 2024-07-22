const { signUpSchema } = require("../models/schema.js");

const isAlreadyLogin = (req, res, next) => {
    if (req.user) {
        // return res.send("Currently you are logedin, to login with new id logout first and then login!");
        res.status(200).json({ data: "already logeed in" })
    }
    next();
}


const isLogedIn = (req, res, next) => {
    if (req.user) {
        next();
    }
    else {
        req.session.redirectUrl = req.originalUrl;
        res.redirect("/auth/login");
    }
}

//after login authentication passport automatically session ke data ko delete karde ta hai, therfore one more middleware which will
// call before authenticating the login post request and store this is res.local as locals is accesibble everywhere and passport
//don't have access to delete locals

const validateUser = (req, res, next) => {
    const { error } = signUpSchema.validate(req.body);

    if (error) {
        console.log(req.body);
        res.status(400).send(error.details[0].message);
    } else {
        next();
    }
}

const isNewUser = (req, res, next) => {
    if (req.session.isFormFilled) {
        res.locals.isNew = true;
    }
    next();
}

// const isFormFilled = (req,res,next) => {
//     if(!req.session.detailsObtained){
//         return res.redirect("/auth/signup/google");
//     }
//     next();
// }


module.exports = { isAlreadyLogin, isLogedIn, validateUser, isNewUser };