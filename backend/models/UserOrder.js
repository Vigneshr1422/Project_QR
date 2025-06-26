const mongoose = require('mongoose');

const UserOrderSchema = new mongoose.Schema({
  tableId: String,
  username: String,
  phone: String,
  cartItems: [
    {
      name: String,
      price: String,
      quantity: Number,
    }
  ],
  totalAmount: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('UserOrder', UserOrderSchema);
