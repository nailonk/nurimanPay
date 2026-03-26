import * as notificationService from '../service/notificationService.js';

export const handleMidtransNotification = async (req, res) => {
  try {
    const result = await notificationService.handleNotificationService(req.body);
    
    if (result.transaction) {
      console.log(`✅ Status order ${result.orderId} updated to ${result.dbStatus}`);
    }

    res.status(200).json({ status: 'OK', message: 'Notification processed' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getStatus = async (req, res) => {
  try {
    const transaction = await notificationService.getTransactionByOrderId(req.params.orderId);
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaksi tidak ditemukan' });
    }
    
    res.json({ success: true, donasi: transaction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};