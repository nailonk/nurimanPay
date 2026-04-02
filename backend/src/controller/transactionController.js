import * as transactionService from '../service/transactionService.js';

export const createTransaction = async (req, res) => {
  try {
    const result = await transactionService.createDonationService(req.body);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Controller Error:', error);
    res.status(500).json({ error: 'Gagal memproses transaksi', details: error.message });
  }
};

export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await transactionService.getAllTransactionsService();
    
    res.json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    console.error('Get All Error:', error);
    res.status(500).json({ error: 'Gagal mengambil data transaksi' });
  }
};

export const checkStatus = async (req, res) => {
  try {
    const status = await transactionService.checkMidtransStatusService(req.params.orderId);
    res.json({ success: true, data: status });
  } catch (error) {
    res.status(500).json({ error: 'Gagal cek status ke Midtrans', details: error.message });
  }
};

export const getDbStatus = async (req, res) => {
  try {
    const data = await transactionService.getDbTransactionService(req.params.orderId);
    if (!data) return res.status(404).json({ error: 'Transaksi tidak ditemukan' });
    
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};