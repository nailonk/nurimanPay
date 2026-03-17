import express from 'express';
import { snap } from '../config/midtrans.js';
import pool from '../config/db.js';

const router = express.Router();

// Endpoint: Buat transaksi donasi
router.post('/create', async (req, res) => {
  try {
    const { nama, no_hp, nominal, catatan, program_id } = req.body;

    // Validasi
    if (!nama || !no_hp || !nominal || nominal < 1000) {
      return res.status(400).json({ 
        error: 'Data tidak lengkap atau nominal minimal Rp 1.000' 
      });
    }

    // Generate Order ID
    const orderId = `DONASI-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Simpan ke database
    const insertQuery = `
      INSERT INTO donasi (nama_donatur, no_hp, nominal, catatan, program_id, order_id, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `;
    
    const insertValues = [nama, no_hp, nominal, catatan, program_id || null, orderId, 'pending'];
    const insertResult = await pool.query(insertQuery, insertValues);
    const donasiId = insertResult.rows[0].id;

    // Parameter untuk Midtrans
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: nominal
      },
      customer_details: {
        first_name: nama,
        phone: no_hp
      },
      item_details: [{
        id: 'donasi-1',
        price: nominal,
        quantity: 1,
        name: 'Donasi Nurul Iman'
      }],
      custom_field1: donasiId.toString()
    };

    // Minta Snap Token ke Midtrans
    const transaction = await snap.createTransaction(parameter);

    // Update token ke database
    const updateQuery = `
      UPDATE donasi 
      SET transaction_token = $1, redirect_url = $2 
      WHERE id = $3
    `;
    await pool.query(updateQuery, [transaction.token, transaction.redirect_url, donasiId]);

    // Return ke frontend
    res.json({
      success: true,
      token: transaction.token,
      redirect_url: transaction.redirect_url,
      order_id: orderId,
      donasi_id: donasiId
    });

  } catch (error) {
    console.error('Midtrans error:', error);
    res.status(500).json({ 
      error: 'Gagal memproses transaksi',
      details: error.message 
    });
  }
});

export default router;