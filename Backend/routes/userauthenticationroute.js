const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user.js");
const { isAlreadyLogin, validateUser, isNewUser } = require("../middlewares/authmiddlewares.js");
const sendMail = require("../config/gmail.js");
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
    function (req, res) {
        // console.log(res.locals, "*****" , req.user);
        if (res.locals.isNew) {
            const mailData = {
                from: 'Koe the Cafe🍵<codingvaibhav247@gmail.com>',
                to: req.user.username,
                subject: 'Welcome to Koe the Cafe',
                text: 'Welcome Message, Have A NICE DAY!',
                html:
                    `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Welcome to Koe the Cafe</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                            color: #333;
                        }
                        .container {
                            width: 100%;
                            max-width: 600px;
                            margin: 0 auto;
                            background-color: #ffffff;
                            padding: 20px;
                            border-radius: 8px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            text-align: center;
                            padding-bottom: 20px;
                        }
                        .header img {
                            max-width: 100px;
                        }
                        .content {
                            text-align: left;
                        }
                        .content h1 {
                            color: #D2691E;
                        }
                        .content p {
                            font-size: 16px;
                            line-height: 1.5;
                        }
                        .footer {
                            text-align: center;
                            padding-top: 20px;
                            font-size: 12px;
                            color: #aaa;
                        }
                        .button {
                            display: inline-block;
                            padding: 10px 20px;
                            margin-top: 20px;
                            background-color: #D2691E;
                            color: #ffffff;
                            text-decoration: none;
                            border-radius: 5px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <img src=${"https://ik.imagekit.io/vaibhav11/Koe_Cafe/mail_images/logo1.jpg?updatedAt=1716863831468"} alt="Koe the Cafe Logo">
                        </div>
                        <div class="content">
                            <h1>Welcome, ${req.user.fullname}!</h1>
                            <p>We're thrilled to have you join us at Koe the Cafe! Thank you for becoming a part of our community. At Koe the Cafe, we're passionate about serving the finest coffee and creating a welcoming atmosphere for all our guests.</p>
                            <p>As a new member, we invite you to explore our range of delicious beverages and treats. Don't forget to check out our special events and workshops designed to bring coffee lovers together.</p>
                            <p>If you have any questions or need assistance, feel free to reach out to our friendly staff at any time. We're here to make your experience at Koe the Cafe memorable.</p>
                            <a href=${"https://admin-koe-the-cafe.onrender.com/"} class="button">Visit Our Website</a>
                            <p>Best Regards,<br>Vaibhav Gupta</p>
                        </div>
                        <div class="footer">
                            <p>&copy; 2024 Koe the Cafe. All rights reserved.</p>
                            <p><a href="#">Unsubscribe</a> from these emails.</p>
                        </div>
                    </div>
                </body>
                </html>`
            }
            sendMail(mailData).then(result => console.log(`mail sent successfully this is result : ${result}`))
                .catch(err => console.log("error bheja ye", err))
        }
        res.redirect(process.env.FRONTEND_DOMAIN);
    });



router.post("/logout", (req, res, next) => {
    //similar to req.login ye bhi inbuilt function hai which takes callback and uses serializ and deserialize method to logout the user 

    req.logout((err) => {
        if (err) {
            next(new ExpressError(400, "logout unsccesfull"));
        } else {
            res.status(200).json({ success: true, message: "Logout Succesfull!" });
        }
    })
});

module.exports = router;