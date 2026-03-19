import { core } from '../config/midtrans.js';
import pool from '../config/db.js';

export const handleNotificationService = async (notification) => {
  // 1. Validasi notifikasi dengan Midtrans
  const statusResponse = await core.transaction.notification(notification);
  const { 
    order_id: orderId, 
    transaction_status: transactionStatus,
    fraud_status: fraudStatus,
    payment_type: paymentType 
  } = statusResponse;

  // 2. Mapping status ke database kita
  let dbStatus = 'pending';
  if (transactionStatus === 'capture') {
    dbStatus = fraudStatus === 'accept' ? 'success' : 'challenge';
  } else if (transactionStatus === 'settlement') {
    dbStatus = 'success';
  } else if (['cancel', 'deny', 'expire'].includes(transactionStatus)) {
    dbStatus = 'failed';
  } else if (transactionStatus === 'refund') {
    dbStatus = 'refund';
  }

  // 3. Update database
  const updateQuery = `
    UPDATE transactions 
    SET status = $1, payment_type = $2, updated_at = NOW() 
    WHERE order_id = $3
    RETURNING *
  `;
  
  const result = await pool.query(updateQuery, [dbStatus, paymentType, orderId]);
  
  return { 
    dbStatus, 
    orderId, 
    transaction: result.rows[0] 
  };
};

export const getTransactionByOrderId = async (orderId) => {
  const query = 'SELECT * FROM transactions WHERE order_id = $1';
  const result = await pool.query(query, [orderId]);
  return result.rows[0];
};