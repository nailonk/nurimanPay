import { core } from "../config/midtrans.js";
import pool from "../config/db.js";
import * as programService from "./programService.js";

export const handleNotificationService = async (notification) => {
  const statusResponse = await core.transaction.notification(notification);

  const {
    order_id: orderId,
    transaction_status: transactionStatus,
    fraud_status: fraudStatus,
    payment_type: paymentType,
    transaction_id: transactionId,
  } = statusResponse;

  let dbStatus = "pending";
  if (transactionStatus === "capture" || transactionStatus === "settlement") {
    dbStatus = fraudStatus === "challenge" ? "challenge" : "success";
  } else if (["cancel", "deny", "expire"].includes(transactionStatus)) {
    dbStatus = "failed";
  }

  const queryMidtrans = `
    INSERT INTO midtrans_payment (
      order_id, transaction_id, payment_type, 
      transaction_status, fraud_status, response_json, updated_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, NOW())
    ON CONFLICT (order_id) 
    DO UPDATE SET 
      transaction_id = EXCLUDED.transaction_id,
      payment_type = EXCLUDED.payment_type,
      transaction_status = EXCLUDED.transaction_status,
      fraud_status = EXCLUDED.fraud_status,
      response_json = EXCLUDED.response_json,
      updated_at = NOW()
  `;
  await pool.query(queryMidtrans, [
    orderId,
    transactionId,
    paymentType,
    transactionStatus,
    fraudStatus,
    JSON.stringify(statusResponse),
  ]);

  const checkOldStatus = await pool.query(
    "SELECT status, amount, program_id, phone_number, name FROM transactions WHERE order_id = $1",
    [orderId],
  );

  const oldTransaction = checkOldStatus.rows[0];

  if (!oldTransaction) return { message: "Order ID not found" };

  if (oldTransaction.status === "success") {
    console.log(
      `Notifikasi diabaikan: Order ${orderId} sudah berstatus SUCCESS sebelumnya.`,
    );
    return { dbStatus: "success", orderId, transaction: oldTransaction };
  }

  const queryTransaction = `
  UPDATE transactions 
  SET status = $1, payment_method = $2, updated_at = NOW() 
  WHERE order_id = $3
  RETURNING *
`;

  const result = await pool.query(queryTransaction, [
    dbStatus,
    paymentType,
    orderId,
  ]);
  const transaction = result.rows[0];

  if (transaction && dbStatus === "success") {
    const danaMasuk = Number(transaction.amount);
    const idProgram = transaction.program_id;

    console.log(
      `Pembayaran Sukses: Program ${idProgram} menerima dana Rp${danaMasuk}`,
    );

    try {
      await programService.addCollectedAmount(idProgram, danaMasuk);
    } catch (err) {
      console.error("Gagal sinkronisasi saldo ke program:", err.message);
    }
  }

  return { dbStatus, orderId, transaction };
};
