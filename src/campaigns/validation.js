import Joi from "joi";

export const campaignSchema = Joi.object({
  id: Joi.number().integer().optional().label("Campaign ID"),
  name: Joi.string().min(3).max(255).required().label("Campaign Name"),
  name_en: Joi.string()
    .min(3)
    .max(255)
    .optional()
    .label("Campaign Name (English)"),
  start_date: Joi.date().required().label("Start Date"),
  draw_date: Joi.date()

    .min(Joi.ref("start_date"))
    .required()
    .label("Draw Date"),
  is_deactivated: Joi.boolean().optional().label("Is Deactivated"),
  prize_name: Joi.string().min(3).max(255).required().label("Prize Name"),
  prize_url: Joi.string().uri().optional().label("Prize URL"),
  remaining_qty: Joi.number()
    .integer()
    .min(0)
    .optional()
    .label("Remaining Quantity"),
  product_id: Joi.number().integer().required().label("Product ID"),
  target: Joi.number().integer().min(1).required().label("Target Quantity"),
  note: Joi.string().allow(null, "").optional().label("Note"),
});
