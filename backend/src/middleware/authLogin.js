import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.js';

export const isAdminOnly = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Harus login sebagai Admin' });
  }

  try {
    const decoded = jwt.verify(token, jwtConfig.secret);

    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Akses ditolak: Anda bukan Admin' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token tidak valid' });
  }
};