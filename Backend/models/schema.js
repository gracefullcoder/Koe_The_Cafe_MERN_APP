const Joi = require("joi");

const registrationSchema = Joi.object({
  userMessage: Joi.string(),
  userPhone: Joi.string()
    .required()
    .regex(/^[0-9]{10}$/)
    .messages({ "string.pattern.base": `Phone number must have 10 digits.` })
    .required(),
});

const signUpSchema = Joi.object({
  fullname: Joi.string().required(),
  gender: Joi.string()
    .valid("Male", "Female", "transgender", "others")
    .required(),
  DOB: Joi.date().required(),
  profilepicture: Joi.object().allow({}, null),
  useremail: Joi.string().email().required(),
  userpassword: Joi.string().required(),
});

const updateUserSchema = Joi.object({
  fullname: Joi.string().required(),
  DOB: Joi.date().required(),
  gender: Joi.string()
    .valid("Male", "Female", "transgender", "others")
    .required(),
  imagecheckbox: Joi.string(),
});

const bookingsSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string()
    .regex(/^[0-9]{10}$/)
    .messages({ "string.pattern.base": `Please Enter a valid phone number` })
    .required(),
  person: Joi.number().required().min(1).max(200),
  startTime: Joi.string().required(),
  endTime: Joi.string().required(),
  date: Joi.date().required(),
  message: Joi.string().allow("", null),
  seats: Joi.array().required(),
});

const editBookingSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string()
    .regex(/^[0-9]{10}$/)
    .messages({ "string.pattern.base": `Please Enter a valid phone number` })
    .required(),
  message: Joi.string().allow("", null),
});

const newSectionSchema = Joi.object({
  label: Joi.string().required(),
  title: Joi.string().required(),
  text: Joi.string().required(),
  myFile: Joi.string().allow("", null),
});

const eventSchema = Joi.object({
  date: Joi.date().required(),
  subtitle: Joi.string().required(),
  title: Joi.string().required(),
  myFile: Joi.string().allow("", null),
});

const editEventSchema = Joi.object({
  date: Joi.date().required(),
  subtitle: Joi.string().required(),
  title: Joi.string().required(),
  myFile: Joi.string().allow("", null),
  imagecheckbox: Joi.string(),
});

const testimonialSchema = Joi.object({
  review: Joi.string().required(),
  suggestion: Joi.string(),
  myFile: Joi.string().allow("", null),
});

const workshopSchema = Joi.object({
  label: Joi.string().required(),
  title: Joi.string().required(),
  text: Joi.string().required(),
  date: Joi.date().required(),
  time: Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/),
});

const editSchema = Joi.object({
  label: Joi.string().required(),
  title: Joi.string().required(),
  text: Joi.string().required(),
  imagecheckbox: Joi.string(),
  myFile: Joi.string().allow("", null),
});

module.exports = {
  signUpSchema,
  updateUserSchema,
  registrationSchema,
  bookingsSchema,
  editBookingSchema,
  newSectionSchema,
  eventSchema,
  editEventSchema,
  testimonialSchema,
  editSchema,
  workshopSchema,
};
