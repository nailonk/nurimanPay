import { core } from '../config/midtrans.js';
import pool from '../config/db.js';

export const handleNotificationService = async (notification) => {
  // 1. Validasi Notifikasi (Mendapatkan data asli & aman dari Midtrans)
  const statusResponse = await core.transaction.notification(notification);
  
  const { 
    order_id: orderId, 
    transaction_status: transactionStatus, // Ambil key yang benar
    fraud_status: fraudStatus,
    payment_type: paymentType,
    transaction_id: transactionId,
    gross_amount: grossAmount
  } = statusResponse;

  // 2. Mapping Status (Konversi status Midtrans ke status DB kita)
  let dbStatus = 'pending';
  if (transactionStatus === 'capture' || transactionStatus === 'settlement') {
    dbStatus = (fraudStatus === 'challenge') ? 'challenge' : 'success';
  } else if (['cancel', 'deny', 'expire'].includes(transactionStatus)) {
    dbStatus = 'failed';
  }

  // 3. Update Tabel 'midtrans_payment' (Log Detail Pembayaran)
  const queryMidtrans = `
    UPDATE midtrans_payment 
    SET 
      transaction_id = $1, 
      payment_type = $2, 
      transaction_status = $3, 
      fraud_status = $4,
      response_json = $5
    WHERE order_id = $6
  `;
  await pool.query(queryMidtrans, [
    transactionId, 
    paymentType, 
    transactionStatus, 
    fraudStatus, 
    JSON.stringify(statusResponse), 
    orderId
  ]);

  // 4. Update Tabel 'transactions' (Status utama aplikasi)
  // Perhatikan: Sesuai ERD, kolomnya adalah 'payment_method'
  const queryTransaction = `
    UPDATE transactions 
    SET status = $1, payment_method = $2, updated_at = NOW() 
    WHERE order_id = $3
    RETURNING *
  `;
  
  const result = await pool.query(queryTransaction, [dbStatus, paymentType, orderId]);

  return { 
    dbStatus, 
    orderId, 
    transaction: result.rows[0] 
  };
};