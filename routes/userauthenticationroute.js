const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user.js");
const { saveRedirectUrl } = require("../middlewares/authmiddlewares.js");
const { isAlreadyLogin, validateUser } = require("../middlewares/authmiddlewares.js");

router.route("/login")
    .get(isAlreadyLogin, (req, res) => {
        res.render("authentication/loginpage.ejs");
    })

    .post(isAlreadyLogin, saveRedirectUrl, passport.authenticate("local", { failureRedirect: '/auth/signup' }), (req, res) => {
        let redirectUrl = res.locals.redirectUrl || "/";
        res.redirect(redirectUrl);
    })


router.route("/signup")

    .get(isAlreadyLogin, (req, res) => {
        res.render("authentication/signup.ejs");
    })


    .post(isAlreadyLogin, validateUser, saveRedirectUrl, async (req, res) => {
        const { fullname, useremail, gender, DOB, userpassword } = req.body;
        let profilepicture = { isUpdated: false };

        if (gender.toLowerCase() == "male") {
            profilepicture.imagelink = process.env["MALE_PROFILE" + Math.floor(Math.random() * 6 + 1)];
        } else {
            profilepicture.imagelink = process.env["FEMALE_PROFILE" + Math.floor(Math.random() * 8 + 1)];
        }
        console.log("user kaa", req.body);

        let user = new User({ username: useremail, fullname: fullname, gender: gender, DOB: DOB, profilepicture });
        let registeredUser = await User.register(user, userpassword);//register will only register the user
        console.log(user);

        //ye req.login(user,cb) is a fnx provide by passport aab user ka log aa gaya
        req.login(registeredUser, (err) => {
            if (err) {
                throw new ExpressError(500, "Not able to authenticate user");
            }
            else {
                let redirectUrl = res.locals.redirectUrl || "/";
                res.redirect(redirectUrl);
            }
        });
    })


router.get("/logout", (req, res) => {
    //similar to req.login ye bhi inbuilt function hai which takes callback and uses serializ and deserialize method to logout the user 
    req.logout((err) => {
        if (err) {
            nextTick(err);
        } else {
            res.redirect("/");
        }
    })
})

module.exports = router;