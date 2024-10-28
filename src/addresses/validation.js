import Joi from "joi";

export const adresseSchema = Joi.object({
  apart_no: Joi.number()
    .integer()
    .positive()
    .required()
    .label("Apartment Number"),
  floor_no: Joi.number().integer().positive().required().label("Floor Number"),
  building_no: Joi.number()
    .integer()
    .positive()
    .required()
    .label("Building Number"),
  street: Joi.string().min(2).max(100).required().label("Street"),
  area: Joi.string().min(2).max(100).required().label("Area"),
  city: Joi.string().min(2).max(50).required().label("City"),
  country: Joi.string().min(2).max(50).required().label("Country"),
});
