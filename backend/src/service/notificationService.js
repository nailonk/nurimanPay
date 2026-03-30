import { core } from '../config/midtrans.js';
import pool from '../config/db.js';
import * as programService from './programService.js';
import whatsappClient from '../config/wa.js';

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

 // 4. Update Tabel 'transactions'
const queryTransaction = `
  UPDATE transactions 
  SET status = $1, payment_method = $2, updated_at = NOW() 
  WHERE order_id = $3
  RETURNING *
`;

const result = await pool.query(queryTransaction, [dbStatus, paymentType, orderId]);
const transaction = result.rows[0]; // Data dari baris tabel 'transactions' yang barusan diupdate

if (transaction && dbStatus === 'success') {
    const danaMasuk = Number(transaction.amount); 
    const idProgram = transaction.program_id;

    console.log(`✅ Sinkronisasi: Program ${idProgram} menerima dana Rp${danaMasuk}`);

    try {
        await programService.addCollectedAmount(idProgram, danaMasuk);

        // 2. PANGGIL FUNGSI KIRIM WA DI SINI (HANYA JIKA SUCCESS)
        await sendDonationStatus(
            transaction.phone_number, // Pastikan nama kolom di DB-mu benar
            transaction.name,   // Pastikan nama kolom di DB-mu benar
            danaMasuk, 
            'BERHASIL'
        );

    } catch (err) {
        console.error('❌ Gagal sinkronisasi atau kirim WA:', err.message);
    }
  }

  return { dbStatus, orderId, transaction };
};

// --- 3. FUNGSI KIRIM WA-NYA TETAP DI BAWAH ---
export const sendDonationStatus = async (nomorHp, namaDonatur, nominal, status) => {
    try {
        let cleanNumber = nomorHp.replace(/\D/g, ''); 
        let formattedNumber = cleanNumber.startsWith('0') ? '62' + cleanNumber.slice(1) : cleanNumber;
        const chatId = `${formattedNumber}@c.us`;

        const pesan = `Halo *${namaDonatur}*,\n\nDonasi sebesar *Rp ${Number(nominal).toLocaleString('id-ID')}* telah kami terima dengan status: *${status}*.\n\nTerima kasih atas kebaikan Anda. 🙏\n-- *NurimanPay* --`;

        await whatsappClient.sendMessage(chatId, pesan);
        console.log(`📩 Notifikasi WA terkirim ke: ${namaDonatur}`);
        return { success: true };
    } catch (error) {
        console.error('❌ Gagal kirim notifikasi WA:', error);
        return { success: false, error };
    }
};