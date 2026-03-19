// src/controller/authController.js
import * as authService from '../service/authService.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email dan password harus diisi' });
    }

    const result = await authService.loginService(email, password);

    res.json({
      success: true,
      message: 'Login berhasil',
      data: result
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};