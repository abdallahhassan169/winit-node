import Joi from "joi";

const itemSchema = Joi.object({
  id: Joi.number().integer().required().label("Campaign ID"),
  qty: Joi.number().integer().min(1).required().label("Quantity"),
});
export const orderSchema = Joi.object({
  address_id: Joi.number().integer().required().label("Address ID"),
  items: Joi.array().items(itemSchema).min(1).required().label("Items"),
});
