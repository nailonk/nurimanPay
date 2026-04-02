import express from 'express';
import * as notificationController from '../controller/notificationController.js';
import authMidtrans from '../middleware/authMidtrans.js';

const router = express.Router();
router.post('/', authMidtrans, notificationController.handleMidtransNotification);

router.get('/status/:orderId', notificationController.getStatus);

export default router;