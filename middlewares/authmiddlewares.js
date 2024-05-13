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

module.exports = { isAlreadyLogin, isLogedIn,saveRedirectUrl };