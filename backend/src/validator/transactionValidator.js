import Joi from 'joi';

export const createTransactionSchema = Joi.object({
  name: Joi.string().min(3).required(),
  phone_number: Joi.string().pattern(/^[0-9]+$/).required(),
  amount: Joi.number().integer().min(10000).required(),
  message: Joi.string().max(255).allow('', null),
  
  // UBAH BAGIAN INI:
  // Dari .number() menjadi .string().uuid()
  program_id: Joi.string().uuid().allow(null).messages({
    'string.uuid': 'ID Program tidak valid (harus format UUID)',
  })
});