const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/save-user
router.post('/save-user', async (req, res) => {
  const { username, phone } = req.body;

  if (!username || !phone) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  try {
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(200).json({ success: true, message: "User already exists" });
    }

    const newUser = new User({ username, phone });
    await newUser.save();
    res.json({ success: true, message: "User saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
module.exports = router;
