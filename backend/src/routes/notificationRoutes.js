import express from 'express';
import { core } from '../config/midtrans.js';
import pool from '../config/db.js';

const router = express.Router();

// Endpoint webhook untuk Midtrans
router.post('/midtrans-notification', async (req, res) => {
  try {
    const notification = req.body;
    console.log('Webhook received:', JSON.stringify(notification, null, 2));

    // Validasi notifikasi dengan Midtrans
    const statusResponse = await core.transaction.notification(notification);
    const { 
      order_id: orderId, 
      transaction_status: transactionStatus,
      fraud_status: fraudStatus,
      payment_type: paymentType,
      gross_amount: grossAmount
    } = statusResponse;

    console.log(`Transaction ${orderId} status: ${transactionStatus}`);

    // Mapping status
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

    // Update database
    const updateQuery = `
      UPDATE donasi 
      SET status = $1, payment_type = $2, updated_at = NOW() 
      WHERE order_id = $3
      RETURNING *
    `;
    
    const updateResult = await pool.query(updateQuery, [dbStatus, paymentType, orderId]);

    if (updateResult.rows.length > 0) {
      console.log(`Status updated to ${dbStatus} for order ${orderId}`);
      
      if (dbStatus === 'success') {
        const donasi = updateResult.rows[0];
        console.log(`Donasi sukses dari ${donasi.nama_donatur}: Rp ${donasi.nominal}`);
      }
    }

    res.status(200).json({ 
      status: 'OK',
      message: 'Notification processed' 
    });

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint cek status
router.get('/status/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const query = 'SELECT * FROM donasi WHERE order_id = $1';
    const result = await pool.query(query, [orderId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transaksi tidak ditemukan' });
    }
    
    res.json({
      success: true,
      donasi: result.rows[0]
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;