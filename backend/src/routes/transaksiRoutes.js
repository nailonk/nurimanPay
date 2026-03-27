import express from 'express';
import { createTransaction, checkStatus, getDbStatus, getAllTransactions } from '../controller/transaksiController.js';
import { validate } from '../middleware/validate.js';
import { createTransactionSchema } from '../validator/transaksiValidator.js';
import { isAdminOnly } from '../middleware/authLogin.js';

const router = express.Router();

// Jika checkout boleh dilakukan siapa saja:
router.post('/create', validate(createTransactionSchema), createTransaction);

// ADMIN ONLY: Melihat semua riwayat uang masuk/transaksi
router.get('/', isAdminOnly, getAllTransactions); 

// Detail status (Biasanya untuk user cek status bayar mereka)
router.get('/check/:orderId', checkStatus);
router.get('/db/:orderId', getDbStatus);

export default router;