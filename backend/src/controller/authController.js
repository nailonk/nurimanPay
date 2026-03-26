import * as authService from '../service/authService.js';

export const login = async (req, res) => {
  try {
    // req.body di sini sudah DIJAMIN valid dan bersih oleh middleware Joi
    const { email, password } = req.body;

    const result = await authService.loginService(email, password);

    res.json({
      success: true,
      message: 'Login berhasil',
      data: result
    });
  } catch (error) {
    // Error dari Service (misal: user tidak ketemu) akan lari ke sini
    res.status(401).json({ error: error.message });
  }
};