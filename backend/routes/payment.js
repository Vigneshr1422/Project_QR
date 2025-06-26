const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');

// ✅ Save successful payment to DB
router.post('/save-payment', async (req, res) => {
  try {
    const { username, phone, tableId, amountPaid, paymentId } = req.body;

    if (!username || !phone || !tableId || !amountPaid || !paymentId) {
      return res.status(400).json({ success: false, error: "Missing fields" });
    }

    const newPayment = new Payment({
      username,
      phone,
      tableId,
      amountPaid,
      paymentId,
      status: "paid"
    });

    await newPayment.save();
    res.json({ success: true, message: "Payment saved" });
  } catch (err) {
    console.error("❌ Error saving payment:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

module.exports = router;
