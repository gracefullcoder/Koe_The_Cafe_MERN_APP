const Joi = require('joi');

const registrationSchema = Joi.object({
    userName: Joi.string().required(),
    userEmail: Joi.string().email().required()
});

const bookingsSchema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().regex(/^[0-9]{10}$/).messages({ 'string.pattern.base': `Phone number must have 10 digits.` }).required(),
    person: Joi.string().required().messages({ 'reason': "Thala for reason!" }),
    time: Joi.string().required(),
    reservationdate: Joi.date().required(),
    message: Joi.string().required()
})

const newSectionSchema = Joi.object({
    label: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    myFile: Joi.string().allow("", null)
})

const eventSchema = Joi.object({
    date: Joi.date().required(),
    subtitle : Joi.string().required(),
    title : Joi.string().required(),
    myFile : Joi.string().required
})

const testimonialSchema = Joi.object({
    name : Joi.string().required(),
    review :Joi.string().required(),
    myFile : Joi.string().allow("",null)
})

const workshopSchema = Joi.object({
    label : Joi.string().required(),
    title : Joi.string().required(), 
    text:Joi.string().required(), 
    date:Joi.date().required(), 
    time:Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/)
})

const editSchema = Joi.object({
    label: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    imagecheckbox : Joi.string(),
    myFile: Joi.string().allow("", null)
})

module.exports = { registrationSchema, bookingsSchema, newSectionSchema,eventSchema,testimonialSchema,editSchema,workshopSchema};