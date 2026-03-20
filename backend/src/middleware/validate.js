export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Ambil semua error jika ada banyak
      stripUnknown: true // SAFETY FIRST: Buang payload aneh yang tidak ada di skema
    });

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      return res.status(400).json({ error: errorMessage });
    }

    // Ganti req.body dengan hasil yang sudah bersih (sanitasi)
    req.body = value;
    next();
  };
};