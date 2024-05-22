const isAlreadyLogin = (req, res, next) => {
    if (req.user) {
        // return res.send("Currently you are logedin, to login with new id logout first and then login!");
        return res.redirect("/");
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

const saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

const {signUpSchema} = require("../models/schema.js");

const validateUser = (req,res,next) =>{
    const {error} = signUpSchema.validate(req.body);

    if(error){
        console.log(req.body);
        res.status(400).send(error.details[0].message);
    }else{
        next();
    }
}

module.exports = { isAlreadyLogin, isLogedIn,saveRedirectUrl,validateUser };