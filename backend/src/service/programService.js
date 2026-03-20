import pool from '../config/db.js';

// Logika simpan program baru
export const createProgramService = async (programData) => {
  const { title, description, target_amount } = programData;

  const query = `
    INSERT INTO programs (title, description, target_amount, collected_amount, status)
    VALUES ($1, $2, $3, 0, 'aktif')
    RETURNING *
  `;
  
  const values = [title, description, target_amount];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// Logika ambil semua program
export const getAllProgramsService = async () => {
  const result = await pool.query('SELECT * FROM programs ORDER BY created_at DESC');
  return result.rows;
};