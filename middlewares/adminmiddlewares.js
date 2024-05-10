const {newSectionSchema,eventSchema,testimonialSchema,editSchema} = require("../models/schema.js");

module.exports.validateNewSection = (req,res,next) => {
    const {error} = newSectionSchema.validate(req.body);
    if(error){
        console.log(error);
        res.status(400).send(error.details[0].message);
    }else{
        next();
    }
}

module.exports.validateEventSection = (req,res,next) => {
    const {error} = eventSchema.validate(req.body);

    if(error){
        res.status(400).send(error.details[0].message);
    }else{
        next();
    }
}


module.exports.validateTestimonial  = (req,res,next) =>{
    const {error} = testimonialSchema.validate(req.body);

    if(error){
        console.log(req.body);
        res.status(400).send(error.details[0].message);
    }else{
        next();
    }
}

module.exports.validateEdit = (req,res,next) => {
    const {error} = editSchema.validate(req.body);
    if(error){
        console.log(typeof(req.body.imagecheckbox));
        res.status(400).send(error.details[0].message);
    }else{
        next();
    }
}


