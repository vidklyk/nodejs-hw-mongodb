import Joi from 'joi';

const stringField = Joi.string().min(3).max(20);

const contactTypeEnum = Joi.string().valid(
  'home',
  'work',
  'personal',
  'business',
  'other',
);

export const createContactSchema = Joi.object({
  name: stringField.required(),
  phoneNumber: Joi.string().required(),
  email: Joi.string().email().optional(),
  isFavourite: Joi.boolean().optional(),
  contactType: contactTypeEnum.required(),
});

export const updateContactSchema = Joi.object({
  name: stringField.optional(),
  phoneNumber: Joi.string().optional(),
  email: Joi.string().email().optional(),
  isFavourite: Joi.boolean().optional(),
  contactType: contactTypeEnum.optional(),
}).min(1);
