import Joi from "joi";

export const adminSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().label("Name"),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .label("Email"),

  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required()
    .label("Phone Number")
    .messages({
      "string.pattern.base":
        "Phone Number must contain only digits and be between 10-15 characters.",
    }),

  password: Joi.string().min(8).max(128).required().label("Password").messages({
    "string.min": "Password must be at least 8 characters long.",
    "string.max": "Password cannot exceed 128 characters.",
  }),
});
