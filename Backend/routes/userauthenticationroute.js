const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user.js");
const { isAlreadyLogin, validateUser, isNewUser } = require("../middlewares/authmiddlewares.js");
const { sendMail, setGmailCredentials, getTokens, welcomeMail } = require("../config/gmail.js");
const { ExpressError, wrapAsync } = require("../utils/wrapAsyncAndExpressError.js")

router.get("/", (req, res) => {
    if (req.user) {
        console.log("requested to authenticate");
        return res.status(200).json({ success: true, user: req.user });
    } else {
        res.status(200).json({ success: false, user: req.user });
    }
})


router.route("/login")

    .post(isAlreadyLogin, passport.authenticate("local", { failureRedirect: '/auth/login/failure' }), (req, res) => {
        console.log("requested to login and it is succesfull");
        res.status(200).json(req.user);
    })


router.get("/login/failure", async (req, res) => {
    res.redirect(`${process.env.FRONTEND_DOMAIN}/auth/signup/google`);
})

router.post("/signup", isAlreadyLogin, validateUser, wrapAsync(async (req, res) => {
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
            res.status(200).json(
                {
                    success: true,
                    message: `${req.user.fullname}, Welcome To Koe The Kafe`
                }
            );
        }
    })
}));

router.post("/signup/google", async (req, res) => {
    let { gender, DOB } = req.body;
    let profilepicture = { isUpdated: false };

    if (gender.toLowerCase() == "male") {
        profilepicture.imagelink = process.env["MALE_PROFILE" + Math.floor(Math.random() * 6 + 1)];
    } else {
        profilepicture.imagelink = process.env["FEMALE_PROFILE" + Math.floor(Math.random() * 8 + 1)];
    }
    console.log("google user kaa data", req.body);

    // if(req.session.federatedCredentials){
    //     let newUser = {
    //         federatedCredentials: req.session.federatedCredentials,
    //         fullname: req.session.fullname,
    //         username: req.session.username,
    //         gender: gender,
    //         DOB: DOB,
    //         profilepicture: profilepicture
    //       }
    //     let newCred = new User(newUser);

    //       // await newCred.save();
    //       req.session.user = newCred;
    //       res.redirect("/oauth2/redirect");
    // }

    req.session.gender = gender;
    req.session.DOB = DOB;
    req.session.profilepicture = profilepicture;
    req.session.isFormFilled = true;
    console.log("session data after signup form:", req.session);
    res.status(200).json({ success: true, message: "Data Validated! Redirecting to Login!" });
});

router.get('/login/google', passport.authenticate('google', { scope: ['openid', 'profile', 'email'] }));

router.get('/oauth2/redirect', isNewUser,
    passport.authenticate('google', { failureRedirect: '/auth/login/failure', failureMessage: true }),
    async function (req, res) {
        if (res.locals.isNew) {
            const userName = req.user.username;
            const tokenData = await getTokens('667870424c40718d9bf7e86e');
            await setGmailCredentials(tokenData);
            const mailData = {
                from: 'Koe the Cafe🍵<codingvaibhav247@gmail.com>',
                to: [userName],
                subject: 'Welcome to Koe the Cafe',
                text: 'Welcome Message, Have A NICE DAY!',
                html: welcomeMail(req.user.fullname)
            }
            sendMail(mailData).then(result => console.log(`mail sent successfully this is result : ${result}`))
                .catch(err => console.log("error bheja ye", err))
        }
        res.redirect(`${process.env.FRONTEND_DOMAIN}`);
    });



router.post("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            next(new ExpressError(400, "logout unsccesfull"));
        } else {
            res.status(200).json({ success: true, message: "Logout Succesfull!" });
        }
    })
});

module.exports = router;