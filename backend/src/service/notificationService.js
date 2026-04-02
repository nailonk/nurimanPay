import { core } from '../config/midtrans.js';
import pool from '../config/db.js';
import * as programService from './programService.js';

export const handleNotificationService = async (notification) => {
  const statusResponse = await core.transaction.notification(notification);
  
  const { 
    order_id: orderId, 
    transaction_status: transactionStatus, 
    fraud_status: fraudStatus,
    payment_type: paymentType,
    transaction_id: transactionId,
    gross_amount: grossAmount
  } = statusResponse;

  let dbStatus = 'pending';
  if (transactionStatus === 'capture' || transactionStatus === 'settlement') {
    dbStatus = (fraudStatus === 'challenge') ? 'challenge' : 'success';
  } else if (['cancel', 'deny', 'expire'].includes(transactionStatus)) {
    dbStatus = 'failed';
  }

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

const checkOldStatus = await pool.query(
  'SELECT status, amount, program_id, phone_number, name FROM transactions WHERE order_id = $1',
  [orderId]
);

const oldTransaction = checkOldStatus.rows[0];

if (!oldTransaction) return { message: 'Order ID not found' };

if (oldTransaction.status === 'success') {
    console.log(`Notifikasi diabaikan: Order ${orderId} sudah berstatus SUCCESS sebelumnya.`);
    return { dbStatus: 'success', orderId, transaction: oldTransaction };
}

// Jika belum success, baru kita update
const queryTransaction = `
  UPDATE transactions 
  SET status = $1, payment_method = $2, updated_at = NOW() 
  WHERE order_id = $3
  RETURNING *
`;

const result = await pool.query(queryTransaction, [dbStatus, paymentType, orderId]);
const transaction = result.rows[0];

if (transaction && dbStatus === 'success') {
    const danaMasuk = Number(transaction.amount); 
    const idProgram = transaction.program_id;

    console.log(`Pembayaran Sukses: Program ${idProgram} menerima dana Rp${danaMasuk}`);

    try {
        await programService.addCollectedAmount(idProgram, danaMasuk);
        
    } catch (err) {
        console.error('Gagal sinkronisasi saldo ke program:', err.message);
    }
}

  return { dbStatus, orderId, transaction };
};

