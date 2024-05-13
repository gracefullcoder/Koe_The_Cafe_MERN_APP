const {workshopSchema,bookingsSchema} = require("../models/schema.js");

module.exports.validateRegistration = (req, res, next) => {
    let { error} = workshopSchema.validate(req.body);
    if (error) {
        console.log(error);
        res.status(400).send(error.details[0].message);
        // throw new Error("Please enter valid details");
    } else {
        next();
    }
}


module.exports.validateBookings = async (req,res,next) => {
    let {error} = await bookingsSchema.validate(req.body);
    if(error){
        console.log(error);
        res.status(400).send(error.details[0].message);
    } else{
        let person = req.body.person;
        console.log();
        if (person[0] <= 0 || person[0] > 8 || person.slice(2) != "person"){
            throw new Error("Wrong Data");
            res.status(400).send("Wrong Data of person!");
        }
        next();
    }
}

module.exports.isLogedIn = (req,res,next) => {
    
}