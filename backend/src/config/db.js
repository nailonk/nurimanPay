import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// log saat koneksi berhasil dibuat
pool.on("connect", () => {
  console.log("Connected to Supabase DB");
});

// handle error
pool.on("error", (err) => {
  console.error("Unexpected DB error:", err);
});

export default pool;