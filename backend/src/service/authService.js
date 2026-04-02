import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.js';

export const loginService = async (email, password) => {
  const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = userResult.rows[0];

  if (!user) {
    throw new Error('Email atau password salah');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Email atau password salah');
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    jwtConfig.secret, // Lebih rapi
    { expiresIn: jwtConfig.expiresIn } // Terpusat di satu file config
  );

  delete user.password;
  return { user, token };
};