import express from 'express';
import * as notificationController from '../controller/notificationController.js';

const router = express.Router();

// Endpoint webhook untuk Midtrans
router.post('/', notificationController.handleMidtransNotification);

// Endpoint cek status di DB
router.get('/status/:orderId', notificationController.getStatus);

export default router;