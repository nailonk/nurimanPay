import express from 'express';
import { createTransaction, checkStatus, getDbStatus, getAllTransactions } from '../controller/transactionController.js';
import { validate } from '../middleware/validate.js';
import { createTransactionSchema } from '../validator/transactionValidator.js';
import { isAdminOnly } from '../middleware/authLogin.js';

const router = express.Router();

router.post('/create', validate(createTransactionSchema), createTransaction);
router.get('/', isAdminOnly, getAllTransactions); 

router.get('/check/:orderId', checkStatus);
router.get('/db/:orderId', getDbStatus);

export default router;