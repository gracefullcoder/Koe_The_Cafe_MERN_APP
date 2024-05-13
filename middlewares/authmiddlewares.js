
const isAlreadylogin = (req,res,next) => {
    if(req.user){
        // return res.send("Currently you are logedin logout to loggin with different id!");
        return res.redirect("/");
    }
    next();
}

module.exports = isAlreadylogin;