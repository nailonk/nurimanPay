import { snap, core } from '../config/midtrans.js';
import pool from '../config/db.js';

export const createDonationService = async (donationData) => {
  const { name, phone_number, amount, message, program_id } = donationData;
  const orderId = `DONASI-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const insertQuery = `
    INSERT INTO transactions (name, phone_number, amount, message, program_id, order_id, status, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, 'pending', CURRENT_TIMESTAMP)
    RETURNING id
  `;
  const insertValues = [name, phone_number, amount, message, program_id || null, orderId];
  const insertResult = await pool.query(insertQuery, insertValues);
  const donasiId = insertResult.rows[0].id;
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
    // callback frontend
    callbacks: {
      finish: `http://localhost:5173/detail-program/${program_id}`,
      error: `http://localhost:5173/detail-program/${program_id}`,
      pending: `http://localhost:5173/detail-program/${program_id}`
    },
    custom_field1: donasiId.toString()
  };

  const midtransResponse = await snap.createTransaction(parameter);
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
  const query = `
    SELECT * FROM transactions 
    ORDER BY created_at DESC
  `;
  const result = await pool.query(query);
  return result.rows;
};

export const checkMidtransStatusService = async (orderId) => {
  const status = await core.transaction.status(orderId);
  const ts = status.transaction_status;

  let dbStatus = 'pending';
  if (ts === 'settlement' || ts === 'capture') dbStatus = 'success';
  else if (['deny', 'cancel', 'expire'].includes(ts)) dbStatus = 'failed';

  const queryUpdate = `
    UPDATE transactions 
    SET status = $1, updated_at = NOW() 
    WHERE order_id = $2 AND status != 'success'
    RETURNING *
  `;
  const result = await pool.query(queryUpdate, [dbStatus, orderId]);

  if (result.rowCount > 0 && dbStatus === 'success') {
    const transaction = result.rows[0];
    const danaMasuk = Number(transaction.amount);
    const idProgram = transaction.program_id;

    console.log(`[CheckStatus] Menambahkan saldo ke program ${idProgram}: Rp${danaMasuk}`);
  }

  return { order_id: orderId, db_status: dbStatus };
};

export const getDbTransactionService = async (orderId) => {
  const result = await pool.query('SELECT * FROM transactions WHERE order_id = $1', [orderId]);
  return result.rows[0];
};