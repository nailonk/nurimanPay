import express from 'express';
import { createTransaction, checkStatus, getDbStatus, getAllTransactions } from '../controller/transaksiController.js';
import { validate } from '../middleware/validate.js';
import { createTransactionSchema } from '../validator/transaksiValidator.js';

const router = express.Router();

// Sekarang route 'create' dijaga ketat oleh Joi
router.post('/create', validate(createTransactionSchema), createTransaction);

router.get('/check/:orderId', checkStatus);
router.get('/', getAllTransactions);
router.get('/db/:orderId', getDbStatus);

export default router;