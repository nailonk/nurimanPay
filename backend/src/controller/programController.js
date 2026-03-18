import pool from '../config/db.js';
export const createProgram = async (req, res) => {
  try {
    // Ambil data dari body (sesuaikan dengan kolom di tabel program kamu)
    const { judul, deskripsi, target_dana } = req.body;

    // Query INSERT (ID UUID akan digenerate otomatis oleh Supabase)
    const query = `
      INSERT INTO program (judul, deskripsi, target_dana, dana_terkumpul)
      VALUES ($1, $2, $3, 0)
      RETURNING *
    `;
    
    const values = [judul, deskripsi, target_dana];
    const result = await pool.query(query, values);

    res.status(201).json({
      success: true,
      message: 'Program berhasil ditambahkan',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error create program:', error);
    res.status(500).json({ error: 'Gagal menambah program' });
  }
};

export const getAllPrograms = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM program ORDER BY created_at DESC');
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error get programs:', error);
    res.status(500).json({ error: 'Gagal mengambil data program' });
  }
};