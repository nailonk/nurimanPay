import express from 'express';
import { core } from '../config/midtrans.js';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

// Inisialisasi Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Endpoint: Cek status transaksi dari Midtrans langsung
router.get('/check/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    // Cek status ke Midtrans
    const status = await core.transaction.status(orderId);
    
    res.json({
      success: true,
      order_id: orderId,
      transaction_status: status.transaction_status,
      fraud_status: status.fraud_status,
      payment_type: status.payment_type,
      gross_amount: status.gross_amount,
      transaction_time: status.transaction_time
    });

  } catch (error) {
    console.error('Check status error:', error);
    res.status(500).json({ 
      error: 'Gagal cek status',
      details: error.message 
    });
  }
});

// Endpoint: Cek status dari database
router.get('/transaksi/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    const { data: donasi, error } = await supabase
      .from('donasi')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Transaksi tidak ditemukan' });
    }

    res.json({
      success: true,
      donasi
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;