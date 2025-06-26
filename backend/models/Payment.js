const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  username: { type: String, required: true },
  phone: { type: String, required: true },
  tableId: { type: String, required: true },
  amountPaid: { type: Number, required: true },
  paymentId: { type: String, required: true }, // Razorpay payment ID
  status: { type: String, default: "paid" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', PaymentSchema);
