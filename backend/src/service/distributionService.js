import pool from "../config/db.js";

export const createDistributionService = async ({
  program_id,
  purpose,
  amount,
  description,
  image,
  distributed_at,
}) => {
  const programCheck = await pool.query(
    "SELECT collected_amount FROM programs WHERE id = $1",
    [program_id],
  );
  if (programCheck.rows.length === 0) return { error: "PROGRAM_NOT_FOUND" };

  const collectedAmount = parseFloat(programCheck.rows[0].collected_amount);

  const totalDistributedResult = await pool.query(
    "SELECT COALESCE(SUM(amount), 0) as total FROM distributions WHERE program_id = $1",
    [program_id],
  );
  const totalDistributed = parseFloat(totalDistributedResult.rows[0].total);
  const sisaDana = collectedAmount - totalDistributed;

  if (amount > sisaDana) return { error: "INSUFFICIENT_FUNDS", sisaDana };

  const insertQuery = `
        INSERT INTO distributions 
            (program_id, purpose, amount, description, image, distributed_at)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
    `;
  const values = [
    program_id,
    purpose,
    amount,
    description || null,
    image || null,
    distributed_at || new Date().toISOString().split("T")[0],
  ];
  const result = await pool.query(insertQuery, values);
  return { data: result.rows[0] };
};


export const getAllDistributionsService = async () => {
  const query = `
        SELECT 
            d.*,
            p.title as program_title
        FROM distributions d
        LEFT JOIN programs p ON d.program_id = p.id
        ORDER BY d.distributed_at DESC
    `;
  const result = await pool.query(query);
  return result.rows;
};

export const getDistributionByIdService = async (id) => {
  const query = `
        SELECT 
            d.*,
            p.title as program_title,
            p.target_amount,
            p.collected_amount
        FROM distributions d
        LEFT JOIN programs p ON d.program_id = p.id
        WHERE d.id = $1
    `;
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

export const getDistributionsByProgramService = async (programId) => {
  const query = `
        SELECT 
            d.*,
            p.title as program_title
        FROM distributions d
        LEFT JOIN programs p ON d.program_id = p.id
        WHERE d.program_id = $1
        ORDER BY d.distributed_at DESC
    `;
  const result = await pool.query(query, [programId]);
  return result.rows;
};

export const getProgramSummaryService = async (programId) => {
  const programQuery = `
        SELECT title, target_amount, collected_amount
        FROM programs 
        WHERE id = $1
    `;
  const programResult = await pool.query(programQuery, [programId]);

  if (programResult.rows.length === 0) return null;

  const distributionQuery = `
        SELECT COALESCE(SUM(amount), 0) as total_distributed 
        FROM distributions 
        WHERE program_id = $1
    `;
  const distributionResult = await pool.query(distributionQuery, [programId]);

  const program = programResult.rows[0];
  const totalDistributed = parseFloat(
    distributionResult.rows[0].total_distributed,
  );
  const totalCollected = parseFloat(program.collected_amount);

  return {
    program_id: programId,
    program_title: program.title,
    target_amount: program.target_amount,
    collected_amount: totalCollected,
    total_distributed: totalDistributed,
    sisa_dana: totalCollected - totalDistributed,
    persentase_penyaluran:
      totalCollected > 0
        ? ((totalDistributed / totalCollected) * 100).toFixed(2)
        : 0,
  };
};

export const updateDistributionService = async (
  id,
  { program_id, purpose, amount, description, image, distributed_at },
) => {
  const oldData = await pool.query("SELECT program_id, amount FROM distributions WHERE id = $1", [id]);
  if (oldData.rows.length === 0) return null;

  const targetProgramId = program_id || oldData.rows[0].program_id;

  if (amount || program_id) {
    const programCheck = await pool.query(
      "SELECT collected_amount FROM programs WHERE id = $1",
      [targetProgramId]
    );
    const collectedAmount = parseFloat(programCheck.rows[0].collected_amount);

    const totalDistResult = await pool.query(
      "SELECT COALESCE(SUM(amount), 0) as total FROM distributions WHERE program_id = $1 AND id != $2",
      [targetProgramId, id] 
    );
    
    const totalLainnya = parseFloat(totalDistResult.rows[0].total);
    const sisaDana = collectedAmount - totalLainnya;
    const newAmount = amount ? parseFloat(amount) : parseFloat(oldData.rows[0].amount);

    if (newAmount > sisaDana) {
      return { error: "INSUFFICIENT_FUNDS", sisaDana };
    }
  }
  const updateQuery = `
        UPDATE distributions 
        SET 
            program_id = COALESCE($1, program_id),
            purpose = COALESCE($2, purpose),
            amount = COALESCE($3, amount),
            description = COALESCE($4, description),
            image = COALESCE($5, image),
            distributed_at = COALESCE($6, distributed_at),
            updated_at = NOW()
        WHERE id = $7
        RETURNING *
    `;
  const values = [
    program_id,
    purpose,
    amount,
    description,
    image,
    distributed_at,
    id,
  ];
  const result = await pool.query(updateQuery, values);
  return result.rows[0] || null;
};

export const deleteDistributionService = async (id) => {
  const result = await pool.query(
    "DELETE FROM distributions WHERE id = $1 RETURNING *",
    [id],
  );
  return result.rows[0] || null;
};
