import crypto from 'crypto';

const authMidtrans = (req, res, next) => {
  const { order_id, status_code, gross_amount, signature_key } = req.body;
  const serverKey = process.env.MIDTRANS_SERVER_KEY;

  const hash = crypto
    .createHash('sha512')
    .update(order_id + status_code + gross_amount + serverKey)
    .digest('hex');

  if (hash !== signature_key) {
    console.error(`[Security] Signature tidak valid untuk Order: ${order_id}`);
    return res.status(403).json({ error: 'Invalid Signature Key' });
  }

  next();
};

export default authMidtrans;