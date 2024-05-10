const Joi = require('joi');

const workshopSchema = Joi.object({
    userName : Joi.string().required(),
    userEmail : Joi.string().email().required()
});

const bookingsSchema = Joi.object({
    name : Joi.string().required(),
    phone : Joi.string().regex(/^[0-9]{10}$/).messages({'string.pattern.base': `Phone number must have 10 digits.`}).required(),
    person :Joi.string().required().messages({'reason':"Thala for reason!"}),
    time : Joi.string().required(),
    reservationdate : Joi.date().required(),
    message : Joi.string().required()
})

module.exports = {workshopSchema,bookingsSchema};