// backend/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const UserOrder = require('../models/UserOrder'); // ✅ correct model

// ✅ POST: Save order
router.post('/submit', async (req, res) => {
  try {
    console.log('📥 Order received:', req.body);

    const { tableId, username, phone, cartItems, totalAmount } = req.body;

    if (!tableId || !username || !phone || !cartItems || !totalAmount) {
      console.warn('🚨 Missing fields:', { tableId, username, phone, cartItems, totalAmount });
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const newOrder = new UserOrder({
      tableId,
      username,
      phone,
      cartItems,
      totalAmount,
    });

    await newOrder.save();
    res.status(201).json({ success: true, message: 'Order saved successfully' });
  } catch (err) {
    console.error('❌ Error saving order:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ✅ GET: All orders for admin
router.get('/admin/all-orders', async (req, res) => {
  try {
    const orders = await UserOrder.find().sort({ createdAt: -1 }); // ✅ fixed model name
    res.json({ success: true, orders });
  } catch (err) {
    console.error("❌ Error fetching orders:", err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
