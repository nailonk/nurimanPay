import { snap, core } from '../config/midtrans.js';
import pool from '../config/db.js';

export const createDonationService = async (donationData) => {
  const { name, phone_number, amount, message, program_id } = donationData;

  const orderId = `DONASI-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // 1. Simpan data awal ke database
  const insertQuery = `
    INSERT INTO transactions (name, phone_number, amount, message, program_id, order_id, status)
    VALUES ($1, $2, $3, $4, $5, $6, 'pending')
    RETURNING id
  `;
  const insertValues = [name, phone_number, amount, message, program_id || null, orderId];
  const insertResult = await pool.query(insertQuery, insertValues);
  const donasiId = insertResult.rows[0].id;

  // 2. Buat transaksi di Midtrans
  const parameter = {
    transaction_details: { order_id: orderId, gross_amount: amount },
    customer_details: { first_name: name, phone: phone_number },
    item_details: [{ id: 'donasi-1', price: amount, quantity: 1, name: 'Donasi Nurul Iman' }],
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

  if (ts === 'settlement' || ts === 'capture') {
    dbStatus = 'success';
  } else if (['deny', 'cancel', 'expire'].includes(ts)) {
    dbStatus = 'failed';
  }

  // 1. Update tabel TRANSACTIONS (untuk status utama)
  await pool.query(
    `UPDATE transactions SET status = $1 WHERE order_id = $2`,
    [dbStatus, orderId]
  );

  // 2. Update tabel MIDTRANS_PAYMENTS (untuk detail pembayaran)
  // Pastikan kolom-kolom ini ada di tabel midtrans_payments kamu
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