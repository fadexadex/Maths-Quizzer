import Joi from "joi";

export const createTopicSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  materials: Joi.string().min(10).required(),
});

