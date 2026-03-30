import { snap, core } from '../config/midtrans.js';
import pool from '../config/db.js';

export const createDonationService = async (donationData) => {
  const { name, phone_number, amount, message, program_id } = donationData;

  const orderId = `DONASI-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // 1. Simpan data awal ke database
  const insertQuery = `
    INSERT INTO transactions (name, phone_number, amount, message, program_id, order_id, status, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, 'pending', CURRENT_TIMESTAMP)
    RETURNING id
  `;
  const insertValues = [name, phone_number, amount, message, program_id || null, orderId];
  const insertResult = await pool.query(insertQuery, insertValues);
  const donasiId = insertResult.rows[0].id;

  // 2. Buat transaksi di Midtrans
  const parameter = {
    transaction_details: { 
      order_id: orderId, 
      gross_amount: amount 
    },
    customer_details: { 
      first_name: name, 
      phone: phone_number 
    },
    item_details: [{ 
      id: 'donasi-1', 
      price: amount, 
      quantity: 1, 
      name: 'Donasi Nurul Iman' 
    }],
    // Tambahkan callbacks sesuai struktur routing frontend temanmu
    // Tapi tetap menggunakan variabel program_id dari kode kamu
    callbacks: {
      finish: `http://localhost:5173/detail-program/${program_id}`,
      error: `http://localhost:5173/detail-program/${program_id}`,
      pending: `http://localhost:5173/detail-program/${program_id}`
    },
    custom_field1: donasiId.toString()
  };

  const midtransResponse = await snap.createTransaction(parameter);

  // 3. Update token ke database
  await pool.query(
    'UPDATE transactions SET transaction_token = $1, redirect_url = $2 WHERE id = $3',
    [midtransResponse.token, midtransResponse.redirect_url, donasiId]
  );

  return {
    token: midtransResponse.token,
    redirect_url: midtransResponse.redirect_url,
    order_id: orderId
  };
};

export const getAllTransactionsService = async () => {
  // Mengambil semua data transaksi, diurutkan dari yang terbaru
  const query = `
    SELECT * FROM transactions 
    ORDER BY created_at DESC
  `;
  const result = await pool.query(query);
  return result.rows;
};

export const checkMidtransStatusService = async (orderId) => {
  const status = await core.transaction.status(orderId);
  
  let dbStatus = 'pending';
  const ts = status.transaction_status;

  // Cek apakah status dari Midtrans adalah sukses
  if (ts === 'settlement' || ts === 'capture') {
    dbStatus = 'success';
  } else if (['deny', 'cancel', 'expire'].includes(ts)) {
    dbStatus = 'failed';
  }

  // 1. Ambil data transaksi lama buat cek status sebelumnya (PENTING!)
  // Ini supaya kalau di-refresh, saldo nggak nambah terus-terusan
  const oldTrans = await pool.query(
    'SELECT status, amount, program_id FROM transactions WHERE order_id = $1', 
    [orderId]
  );
  const currentDbStatus = oldTrans.rows[0]?.status;
  const amount = oldTrans.rows[0]?.amount;
  const programId = oldTrans.rows[0]?.program_id;

  // 2. Update tabel TRANSACTIONS (Status Utama)
  await pool.query(
    `UPDATE transactions SET status = $1, updated_at = NOW() WHERE order_id = $2`,
    [dbStatus, orderId]
  );

  // 3. LOGIKA TAMBAHAN: Kalau status berubah jadi success dan sebelumnya BELUM success
  if (dbStatus === 'success' && currentDbStatus !== 'success' && programId) {
    await pool.query(
      `UPDATE programs SET collected_amount = collected_amount + $1 WHERE id = $2`,
      [amount, programId]
    );
  }

  // 4. Update tabel MIDTRANS_PAYMENTS
  await pool.query(
    `UPDATE midtrans_payments 
     SET transaction_status = $1, payment_type = $2, updated_at = NOW() 
     WHERE order_id = $3`,
    [ts, status.payment_type, orderId]
  );

  return {
    order_id: orderId,
    midtrans_status: ts,
    db_status: dbStatus,
    payment_method: status.payment_type
  };
};

export const getDbTransactionService = async (orderId) => {
  const result = await pool.query('SELECT * FROM transactions WHERE order_id = $1', [orderId]);
  return result.rows[0];
};