const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user.js");
const { nextTick } = require("process");

router.route("/login")
    .get((req, res) => {
        res.render("authentication/loginpage.ejs");
    })

    .post(passport.authenticate("local", { failureRedirect: '/auth/signup' }), (req, res) => {
        res.redirect("/");
    })


router.route("/signup")

    .get((req, res) => {
        res.render("authentication/signup.ejs");
    })


    .post(async (req, res) => {
        const { fullname, useremail, userpassword } = req.body;
        let user = new User({ username: useremail, fullname: fullname });
        let registeredUser = await User.register(user, userpassword);//register will only register the user

        //ye req.login(user,cb) is a fnx provide by passport aab user ka log aa gaya
        req.login(registeredUser, (err) => {
            if (err) {
                throw new ExpressError(500, "Not able to authenticate user");
            }
            else {
                res.redirect("/");
            }
        });
    })


router.get("/logout",(req,res)=>{
    //similar to req.login ye bhi inbuilt function hai which takes callback and uses serializ and deserialize method to logout the user 
    req.logout((err)=>{
        if(err){
            nextTick(err);
        }else{
            res.redirect("/");
        }
    })
})

module.exports = router;