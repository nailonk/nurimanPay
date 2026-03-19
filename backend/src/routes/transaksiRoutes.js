import express from 'express';
import { createTransaction, checkStatus, getDbStatus, getAllTransactions } from '../controller/transaksiController.js';

const router = express.Router();

router.post('/create', createTransaction);
router.get('/check/:orderId', checkStatus);
router.get('/', getAllTransactions);
router.get('/db/:orderId', getDbStatus);

export default router;