import pool from "../config/db.js";

export const createProgramService = async (programData) => {
  const { title, description, target_amount, end_date, image } = programData;
  const result = await pool.query(
    `INSERT INTO programs (title, description, target_amount, end_date, image, collected_amount, status)
     VALUES ($1, $2, $3, $4, $5, 0, 'aktif') RETURNING *`,
    [title, description, target_amount, end_date, image]
  );
  return result.rows[0];
};

export const getProgramByIdService = async (id) => {
  const result = await pool.query("SELECT * FROM programs WHERE id = $1", [id]);
  return result.rows[0] || null;
};

export const getAllProgramsService = async () => {
  const result = await pool.query(`SELECT * FROM programs ORDER BY created_at DESC`);
  return result.rows;
};

export const getProgramTransactionsService = async (programId) => {
  const result = await pool.query(
    "SELECT * FROM transactions WHERE program_id = $1 ORDER BY created_at DESC", 
    [programId]
  );
  return result.rows;
};

export const addCollectedAmount = async (programId, amount) => {
  await pool.query(
    "UPDATE programs SET collected_amount = collected_amount + $1 WHERE id = $2",
    [amount, programId]
  );
};

export const updateProgramService = async (id, data) => {
  const { title, description, target_amount, end_date, status, image } = data;
  const result = await pool.query(
    `UPDATE programs SET title = $1, description = $2, target_amount = $3, 
     end_date = $4, status = $5, image = COALESCE($6, image), updated_at = NOW()
     WHERE id = $7 RETURNING *`,
    [title, description, target_amount, end_date, status, image, id]
  );
  return result.rows[0];
};

export const deleteProgramService = async (id) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    await client.query(`DELETE FROM midtrans_payment WHERE order_id IN 
      (SELECT order_id FROM transactions WHERE program_id = $1)`, [id]);
    await client.query("DELETE FROM transactions WHERE program_id = $1", [id]);
    await client.query("DELETE FROM distributions WHERE program_id = $1", [id]);
    
    const result = await client.query("DELETE FROM programs WHERE id = $1 RETURNING *", [id]);
    
    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error; 
  } finally {
    client.release();
  }
};