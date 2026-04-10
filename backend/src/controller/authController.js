import * as authService from '../service/authService.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

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