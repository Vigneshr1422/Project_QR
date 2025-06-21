// routes/contact.js

const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// POST /api/contact
router.post('/', async (req, res) => {
  const { name, email, phone, address, message } = req.body;
  if (!name || !email || !phone || !message) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    const newMsg = new Contact({ name, email, phone, address, message });
    await newMsg.save();
    res.status(200).json({ success: true, message: 'Message saved' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/contact/testimonials
router.get('/testimonials', async (req, res) => {
  try {
    const testimonials = await Contact.find().sort({ createdAt: -1 }).limit(10);
    res.status(200).json(testimonials);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch testimonials' });
  }
});

module.exports = router;
