import midtransClient from 'midtrans-client';
import 'dotenv/config';

// Snap instance untuk transaksi
const snap = new midtransClient.Snap({
  isProduction: false, // ganti true untuk production
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY
});

// Core API instance untuk cek status
const core = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY
});

export { snap, core };