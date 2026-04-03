import pool from "../config/db.js";

export const createProgramService = async (programData) => {
  const { title, description, target_amount, end_date } = programData;

  const query = `
    INSERT INTO programs (title, description, target_amount, end_date, collected_amount, status)
    VALUES ($1, $2, $3, $4, 0, 'aktif')
    RETURNING *
  `;

  const values = [title, description, target_amount, end_date];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getAllProgramsService = async () => {
  const result = await pool.query(
    "SELECT * FROM programs ORDER BY created_at DESC",
  );
  return result.rows;
};

export const getTransactionsByProgramService = async (programId) => {
  try {
    const query = `
      SELECT * FROM transactions 
      WHERE program_id = $1 
      ORDER BY created_at DESC
    `;

    const result = await pool.query(query, [programId]);

    return result.rows;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

export const addCollectedAmount = async (programId, amount) => {
  const query = `
    UPDATE programs 
    SET collected_amount = collected_amount + $1 
    WHERE id = $2
  `;
  await pool.query(query, [amount, programId]);
};

export const updateProgramService = async (id, data) => {
  const { title, description, target_amount, end_date, status } = data;

  const result = await pool.query(
    `UPDATE programs 
         SET title = $1, description = $2, target_amount = $3, end_date = $4, status = $5, updated_at = NOW()
         WHERE id = $6
         RETURNING *`,
    [title, description, target_amount, end_date, status, id],
  );
  return result.rows[0];
};

export const deleteProgramService = async (id) => {
  const result = await pool.query(
    "DELETE FROM programs WHERE id = $1 RETURNING *",
    [id],
  );
  return result.rows[0];
};
