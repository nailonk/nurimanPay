import Joi from 'joi';

export const createProgramSchema = Joi.object({
  title: Joi.string().min(5).max(100).trim().required().messages({
    'string.min': 'Judul program minimal 5 karakter',
    'any.required': 'Judul program wajib diisi'
  }),
  description: Joi.string().max(1000).allow('', null).messages({
    'string.max': 'Deskripsi terlalu panjang (maksimal 1000 karakter)'
  }),
  target_amount: Joi.number().integer().min(100000).required().messages({
    'any.required': 'Target nominal wajib diisi'
  }),
  end_date: Joi.date().iso().allow(null, '').messages({
    'date.format': 'Format tanggal tidak valid'
  }),
  image: Joi.string().allow(null, '').messages({
    'string.base': 'Format gambar harus berupa string/base64'
  }),
  status: Joi.string().valid('aktif', 'selesai', 'draft').optional()
});