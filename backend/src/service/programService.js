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
export const getTransactionsByProgramService = async (programId) => {
  try {
    const query = `
      SELECT * FROM transactions 
      WHERE program_id = $1 
      ORDER BY created_at DESC
    `; 
    // Catatan: Di screenshot tidak terlihat kolom transaction_date, 
    // biasanya defaultnya created_at. Sesuaikan dengan kolom aslimu ya.

    const result = await pool.query(query, [programId]);
    
    return result.rows; // Mengembalikan array (bisa kosong [] jika tidak ada transaksi)
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};